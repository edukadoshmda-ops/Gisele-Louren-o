/**
 * Serviço de Integração Nativa com a API Mercado Pago (https://www.mercadopago.com.br/developers)
 * Suporta:
 *  - Assinaturas Recorrentes (/preapproval)
 *  - Pagamentos PIX, Boleto e Cartão (/v1/payments)
 *  - Webhooks Automáticos (/api/mercadopago/webhook)
 *  - Fallback Inteligente (Modo Simulação) quando o Access Token ainda não está configurado
 */

class MercadoPagoService {
  constructor() {
    this.accessToken = process.env.MP_ACCESS_TOKEN || "";
    this.publicKey = process.env.MP_PUBLIC_KEY || "";
    this.environment = process.env.MP_ENVIRONMENT || "sandbox";
    this.webhookSecret = process.env.MP_WEBHOOK_SECRET || "segredo_mp_gisele_daviliz_2026";
  }

  getBaseUrl() {
    return "https://api.mercadopago.com";
  }

  isLiveConfigured() {
    return Boolean(this.accessToken && this.accessToken.trim().length > 10);
  }

  setConfig({ accessToken, publicKey, environment, webhookSecret }) {
    if (typeof accessToken === "string") this.accessToken = accessToken.trim();
    if (typeof publicKey === "string") this.publicKey = publicKey.trim();
    if (environment === "sandbox" || environment === "production") {
      this.environment = environment;
    }
    if (typeof webhookSecret === "string" && webhookSecret.trim()) {
      this.webhookSecret = webhookSecret.trim();
    }
  }

  getConfigSummary() {
    return {
      environment: this.environment,
      baseUrl: this.getBaseUrl(),
      isLiveConfigured: this.isLiveConfigured(),
      hasPublicKey: Boolean(this.publicKey && this.publicKey.trim().length > 5),
      maskedAccessToken: this.isLiveConfigured()
        ? `${this.accessToken.slice(0, 10)}...${this.accessToken.slice(-4)}`
        : "Modo Simulação Interativa (Sem Access Token configurado)",
      webhookEndpoint: "/api/mercadopago/webhook",
      webhookSecret: this.webhookSecret
    };
  }

  async requestMercadoPago(endpoint, method = "GET", body = null, idempotencyKey = null) {
    const url = `${this.getBaseUrl()}${endpoint}`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.accessToken}`,
      "User-Agent": "ClubeGiseleDaviLizSaaS/1.0"
    };
    if (idempotencyKey) {
      headers["X-Idempotency-Key"] = idempotencyKey;
    }

    const options = { method, headers };
    if (body) options.body = JSON.stringify(body);

    const response = await fetch(url, options);
    const data = await response.json();
    if (!response.ok) {
      const errorMsg =
        data?.message ||
        data?.cause?.[0]?.description ||
        `Erro Mercado Pago HTTP ${response.status}`;
      throw new Error(errorMsg);
    }
    return data;
  }

  /**
   * Cria assinatura / cobrança no Mercado Pago (ou simula em modo demonstração)
   */
  async createSubscription({ customer, plan, billingType, cycle = "MONTHLY", creditCard = null }) {
    const amount = cycle === "YEARLY" ? plan.priceYearly : plan.priceMonthly;
    const nextDueDate = new Date(Date.now() + 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

    const cpfDigits = (customer.cpfCnpj || "").replace(/\D/g, "");
    const docType = cpfDigits.length > 11 ? "CNPJ" : "CPF";
    const nameParts = (customer.name || "Assinante Clube").trim().split(/\s+/);
    const firstName = nameParts[0] || "Assinante";
    const lastName = nameParts.slice(1).join(" ") || "Clube";

    if (this.isLiveConfigured()) {
      try {
        const idempotency = `mp_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

        if (billingType === "PIX" || billingType === "BOLETO") {
          const paymentPayload = {
            transaction_amount: Number(amount.toFixed(2)),
            description: `Assinatura ${plan.name} (${cycle === "YEARLY" ? "Anual" : "Mensal"}) - Gisele Lourenço & DaviLiz`,
            payment_method_id: billingType === "PIX" ? "pix" : "bolbradesco",
            external_reference: `${plan.id}_${Date.now()}`,
            payer: {
              email: customer.email,
              first_name: firstName,
              last_name: lastName,
              identification: {
                type: docType,
                number: cpfDigits
              }
            }
          };

          const mpPay = await this.requestMercadoPago("/v1/payments", "POST", paymentPayload, idempotency);
          const txData = mpPay?.point_of_interaction?.transaction_data || {};

          return {
            gateway: "MERCADOPAGO",
            mode: "LIVE_MERCADOPAGO_API",
            mpCustomerId: mpPay.payer?.id || `mp_cus_${Date.now()}`,
            mpSubscriptionId: `mp_pay_${mpPay.id}`,
            status: mpPay.status === "approved" ? "ACTIVE" : "PENDING",
            amount,
            nextDueDate,
            billingType,
            cycle,
            paymentDetails: {
              paymentId: String(mpPay.id),
              invoiceUrl: txData.ticket_url || mpPay.transaction_details?.external_resource_url || "",
              pixPayload: txData.qr_code || "",
              pixEncodedImage: txData.qr_code_base64 || "",
              boletoLinhaDigitavel: mpPay.barcode?.content || ""
            }
          };
        }

        // Assinatura recorrente via Preapproval (Cartão de Crédito / Checkout Mercado Pago)
        const preapprovalPayload = {
          reason: `Assinatura ${plan.name} - Clube Gisele Lourenço & DaviLiz`,
          external_reference: `${plan.id}_${Date.now()}`,
          payer_email: customer.email,
          auto_recurring: {
            frequency: cycle === "YEARLY" ? 12 : 1,
            frequency_type: "months",
            transaction_amount: Number(amount.toFixed(2)),
            currency_id: "BRL"
          },
          back_url: "http://localhost:3000",
          status: "pending"
        };

        const mpSub = await this.requestMercadoPago("/preapproval", "POST", preapprovalPayload, idempotency);

        return {
          gateway: "MERCADOPAGO",
          mode: "LIVE_MERCADOPAGO_API",
          mpCustomerId: mpSub.payer_id ? String(mpSub.payer_id) : `mp_cus_${Date.now()}`,
          mpSubscriptionId: mpSub.id,
          status: mpSub.status === "authorized" ? "ACTIVE" : "PENDING",
          amount,
          nextDueDate,
          billingType,
          cycle,
          paymentDetails: {
            paymentId: mpSub.id,
            invoiceUrl: mpSub.init_point || mpSub.sandbox_init_point || ""
          }
        };
      } catch (err) {
        throw new Error(`Falha na API Mercado Pago: ${err.message}`);
      }
    }

    // MODO SIMULAÇÃO INTERATIVA MERCADO PAGO
    const randId = Math.floor(100000000 + Math.random() * 900000000);
    const mpCustomerId = `mp_cus_sim_${randId}`;
    const mpSubscriptionId = `mp_sub_sim_${randId}`;
    const paymentId = `mp_pay_sim_${randId}`;

    const pixCopyPaste = `00020126580014br.gov.bcb.pix0136mercadopago-gisele-daviliz-pix5204000053039865405${amount.toFixed(
      2
    )}5802BR5925GISELE LOURENCO DAVILIZ6009FORTALEZA62070503***6304MP01`;

    return {
      gateway: "MERCADOPAGO",
      mode: "SIMULATED_MERCADOPAGO_SANDBOX",
      mpCustomerId,
      mpSubscriptionId,
      status: billingType === "CREDIT_CARD" ? "ACTIVE" : "PENDING",
      amount,
      nextDueDate,
      billingType,
      cycle,
      paymentDetails: {
        paymentId,
        invoiceUrl: `https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=${mpSubscriptionId}`,
        pixPayload: billingType === "PIX" ? pixCopyPaste : null,
        boletoLinhaDigitavel:
          billingType === "BOLETO"
            ? "23793.38128 60000.000003 00000.000408 1 99990000006990"
            : null
      }
    };
  }
}

module.exports = { MercadoPagoService };
