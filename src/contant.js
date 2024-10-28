export const Contant = (t) => {
  return {
    delivery: {
      fast: "FAST",
      gojek: "GO_JEK",
    },
    payment: {
      paymentincash: t("order.payment.paymentincash"),
      momo: t("order.payment.momo"),
      zalopay: t("order.payment.zalopay"),
      paypal: t("order.payment.paypal"),
    },
    status: {
      1: {
        label: t("order.status.1"),
        color: "#00796b",
        backgroundColor: "#e0f7fa",
      },
      2: {
        label: t("order.status.2"),
        color: "#303f9f",
        backgroundColor: "#e8eaf6",
      },
      3: {
        label: t("order.status.3"),
        color: "#f57c00",
        backgroundColor: "#fff3e0",
      },
      4: {
        label: t("order.status.4"),
        color: "#388e3c",
        backgroundColor: "#e8f5e9",
      },
      5: {
        label: t("order.status.5"),
        color: "#d32f2f",
        backgroundColor: "#ffebee",
      },
    },
  };
};
