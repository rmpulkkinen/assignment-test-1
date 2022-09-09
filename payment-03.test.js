const { paymentProcess } = require("./payment");
const fetchMock = require("jest-fetch-mock");

fetchMock.enableMocks();

beforeEach(() => {
  fetch.resetMocks();
});

describe("flow", () => {
  it("test the payment flow", async () => {
    fetch.mockResponseOnce(JSON.stringify({ validCard: true }));
    fetch.mockResponseOnce(JSON.stringify({ ok: true }));

    const person = {
      firstName: "James",
      middleName: "Roger",
      lastName: "Smith",
    };
    const cc = {
      number: "0123456789012345",
      cvc: "123",
    };
    const payment = { sum: 10 };
    const paymentIsOk = await paymentProcess(person, cc, payment);

    expect(paymentIsOk).toBe("OK");
  });

  it("test the payment flow - INVALID_INPUT", async () => {
    fetch.mockResponseOnce(JSON.stringify({ validCard: true }));
    fetch.mockResponseOnce(JSON.stringify({ ok: true }));

    const person = {
      firstName: "James",
      middleName: "Roger",
      lastName: "Smith",
    };
    const cc = {
      number: "0123456789012345",
      cvc: "",
    };
    const payment = { sum: 10 };
    const paymentIsOk = await paymentProcess(person, cc, payment);

    expect(paymentIsOk).toBe("INVALID_INPUT");
  });

  it("test the payment flow - INVALID_INPUT", async () => {
    fetch.mockResponseOnce(JSON.stringify({ validCard: true }));
    fetch.mockResponseOnce(JSON.stringify({ ok: true }));

    const person = {
      firstName: "James",
      middleName: "Roger",
      lastName: "Smith",
    };
    const cc = {
      number: "0123456789012345",
      cvc: "123",
    };
    const payment = { sum: -10 };
    const paymentIsOk = await paymentProcess(person, cc, payment);

    expect(paymentIsOk).toBe("INVALID_INPUT");
  });

  it("test the payment flow - INVALID_PERSON", async () => {
    fetch.mockResponseOnce(JSON.stringify({ validCard: true }));
    fetch.mockResponseOnce(JSON.stringify({ ok: true }));

    const person = {
      firstName: "",
      middleName: "Roger",
      lastName: "Smith",
    };
    const cc = {
      number: "0123456789012345",
      cvc: "123",
    };
    const payment = { sum: 10 };
    const paymentIsOk = await paymentProcess(person, cc, payment);

    expect(paymentIsOk).toBe("INVALID_PERSON");
  });

  it("test the payment flow - INVALID_CARD", async () => {
    fetch.mockResponseOnce(JSON.stringify({ validCard: false }));
    fetch.mockResponseOnce(JSON.stringify({ ok: true }));

    const person = {
      firstName: "James",
      middleName: "Roger",
      lastName: "Smith",
    };
    const cc = {
      number: "0123456789012345",
      cvc: "123",
    };
    const payment = { sum: 10 };
    const paymentIsOk = await paymentProcess(person, cc, payment);

    expect(paymentIsOk).toBe("INVALID_CARD");
  });

  it("test the payment flow - PAYMENT_FAILED", async () => {
    fetch.mockResponseOnce(JSON.stringify({ validCard: true }));
    fetch.mockResponseOnce(JSON.stringify({ ok: false }));

    const person = {
      firstName: "James",
      middleName: "Roger",
      lastName: "Smith",
    };
    const cc = {
      number: "0123456789012345",
      cvc: "123",
    };
    const payment = { sum: 10 };
    const paymentIsOk = await paymentProcess(person, cc, payment);

    expect(paymentIsOk).toBe("PAYMENT_FAILED");
  });

  it("test the payment flow - INVALID_CARD before INVALID_PAYMENT", async () => {
    fetch.mockResponseOnce(JSON.stringify({ validCard: false }));
    fetch.mockResponseOnce(JSON.stringify({ ok: false }));

    const person = {
      firstName: "James",
      middleName: "Roger",
      lastName: "Smith",
    };
    const cc = {
      number: "0123456789012345",
      cvc: "123",
    };
    const payment = { sum: 10 };
    const paymentIsOk = await paymentProcess(person, cc, payment);

    expect(paymentIsOk).toBe("INVALID_CARD");
  });
});
