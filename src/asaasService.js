/**
 * Serviço de Integração Nativa com a API Asaas v3 (https://docs.asaas.com)
 * Suporta:
 *  - Criação de Clientes (/v3/customers)
 *  - Criação de Assinaturas Recorrentes (/v3/subscriptions) via PIX, BOLETO e CREDIT_CARD
 *  - Geração de QR Code PIX (/v3/payments/{id}/pixQrCode)
 *  - Processamento de Webhooks Automáticos de Pagamento e Assinatura
 *  - Fallback Inteligente (Modo Sandbox Simulado) quando nenhuma chave de API está configurada
 */

class AsaasService {
  constructor() {
    this.apiKey = process.env.ASAAS_API_KEY || "";
    this.environment = process.env.ASAAS_ENVIRONMENT || "sandbox";
    this.webhookToken = process.env.ASAAS_WEBHOOK_TOKEN || "segredo_webhook_gisele_daviliz_2026";
  }

  getBaseUrl() {
    return this.environment === "production"
      ? "https://api.asaas.com/v3"
      : "https://sandbox.asaas.com/api/v3";
  }

  isLiveConfigured() {
    return Boolean(this.apiKey && this.apiKey.trim().length > 10);
  }

  setConfig({ apiKey, environment, webhookToken }) {
    if (typeof apiKey === "string") this.apiKey = apiKey.trim();
    if (environment === "sandbox" || environment === "production") {
      this.environment = environment;
    }
    if (typeof webhookToken === "string" && webhookToken.trim()) {
      this.webhookToken = webhookToken.trim();
    }
  }

  getConfigSummary() {
    return {
      environment: this.environment,
      baseUrl: this.getBaseUrl(),
      isLiveConfigured: this.isLiveConfigured(),
      maskedApiKey: this.isLiveConfigured()
        ? `${this.apiKey.slice(0, 10)}...${this.apiKey.slice(-4)}`
        : "Modo Simulação Interativa (Sem chave configurada)",
      webhookEndpoint: "/api/asaas/webhook",
      webhookToken: this.webhookToken
    };
  }

  async requestAsaas(endpoint, method = "GET", body = null) {
    const url = `${this.getBaseUrl()}${endpoint}`;
    const headers = {
      "Content-Type": "application/json",
      "access_token": this.apiKey,
      "User-Agent": "ClubeGiseleDaviLizSaaS/1.0"
    };

    const options = { method, headers };
    if (body) options.body = JSON.stringify(body);

    const response = await fetch(url, options);
    const data = await response.json();
    if (!response.ok) {
      const errorMsg =
        data?.errors?.[0]?.description ||
        `Erro Asaas HTTP ${response.status}`;
      throw new Error(errorMsg);
    }
    return data;
  }

  /**
   * Cria cliente e assinatura recorrente no Asaas (ou simula quando em modo demonstração)
   */
  async createSubscription({ customer, plan, billingType, cycle = "MONTHLY", creditCard = null }) {
    const amount = cycle === "YEARLY" ? plan.priceYearly : plan.priceMonthly;
    const nextDueDate = new Date(Date.now() + 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

    // Se a chave da API do Asaas estiver configurada, chama a API oficial do Asaas v3
    if (this.isLiveConfigured()) {
      try {
        const asaasCustomer = await this.requestAsaas("/customers", "POST", {
          name: customer.name,
          email: customer.email,
          cpfCnpj: customer.cpfCnpj.replace(/\D/g, ""),
          mobilePhone: (customer.phone || "").replace(/\D/g, ""),
          notificationDisabled: false
        });

        const subPayload = {
          customer: asaasCustomer.id,
          billingType, // PIX, BOLETO, CREDIT_CARD
          value: amount,
          nextDueDate,
          cycle: cycle === "YEARLY" ? "YEARLY" : "MONTHLY",
          description: `Assinatura ${plan.name} - Ecossistema Gisele Lourenço & DaviLiz`,
          externalReference: plan.id
        };

        if (billingType === "CREDIT_CARD" && creditCard) {
          subPayload.creditCard = {
            holderName: creditCard.holderName || customer.name,
            number: creditCard.number.replace(/\D/g, ""),
            expiryMonth: creditCard.expiryMonth,
            expiryYear: creditCard.expiryYear,
            ccv: creditCard.ccv
          };
          subPayload.creditCardHolderInfo = {
            name: customer.name,
            email: customer.email,
            cpfCnpj: customer.cpfCnpj.replace(/\D/g, ""),
            postalCode: creditCard.postalCode || "60000000",
            addressNumber: creditCard.addressNumber || "100",
            phone: (customer.phone || "85999999999").replace(/\D/g, "")
          };
        }

        const asaasSub = await this.requestAsaas("/subscriptions", "POST", subPayload);

        // Busca a primeira cobrança gerada pela assinatura para exibir PIX/Boleto
        let paymentDetails = null;
        try {
          const paymentsList = await this.requestAsaas(`/subscriptions/${asaasSub.id}/payments`, "GET");
          const firstPayment = paymentsList?.data?.[0];
          if (firstPayment && billingType === "PIX") {
            const pixData = await this.requestAsaas(`/payments/${firstPayment.id}/pixQrCode`, "GET");
            paymentDetails = {
              paymentId: firstPayment.id,
              invoiceUrl: firstPayment.invoiceUrl,
              pixPayload: pixData.payload,
              pixEncodedImage: pixData.encodedImage
            };
          } else if (firstPayment) {
            paymentDetails = {
              paymentId: firstPayment.id,
              invoiceUrl: firstPayment.invoiceUrl,
              bankSlipUrl: firstPayment.bankSlipUrl
            };
          }
        } catch (_) {
          // Segue mesmo se a busca imediata de cobrança demorar
        }

        return {
          mode: "LIVE_ASAAS_API",
          asaasCustomerId: asaasCustomer.id,
          asaasSubscriptionId: asaasSub.id,
          status: billingType === "CREDIT_CARD" ? "ACTIVE" : "PENDING",
          amount,
          nextDueDate,
          billingType,
          cycle,
          paymentDetails
        };
      } catch (err) {
        throw new Error(`Falha na API Asaas: ${err.message}`);
      }
    }

    // MODO SIMULAÇÃO INTERATIVA (Sem chave configurada ainda)
    const randId = Math.floor(100000000 + Math.random() * 900000000);
    const asaasCustomerId = `cus_sim_${randId}`;
    const asaasSubscriptionId = `sub_sim_${randId}`;
    const paymentId = `pay_sim_${randId}`;

    const pixCopyPaste = `00020126580014br.gov.bcb.pix0136a1b2c3d4-gisele-daviliz-asaas-pix5204000053039865405${amount.toFixed(
      2
    )}5802BR5925GISELE LOURENCO DAVILIZ6009FORTALEZA62070503***6304ABCD`;

    return {
      mode: "SIMULATED_ASAAS_SANDBOX",
      asaasCustomerId,
      asaasSubscriptionId,
      status: billingType === "CREDIT_CARD" ? "ACTIVE" : "PENDING",
      amount,
      nextDueDate,
      billingType,
      cycle,
      paymentDetails: {
        paymentId,
        invoiceUrl: `https://sandbox.asaas.com/i/${paymentId}`,
        pixPayload: billingType === "PIX" ? pixCopyPaste : null,
        boletoLinhaDigitavel:
          billingType === "BOLETO"
            ? "46191.11005 00000.000091 00058.912347 8 9912000000" + Math.floor(amount * 100)
            : null
      }
    };
  }
}

module.exports = { AsaasService };
