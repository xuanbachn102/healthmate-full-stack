import crypto from 'crypto';

/**
 * MoMo Payment Service
 * Documentation: https://developers.momo.vn/v3/
 */

/**
 * Create MoMo payment request
 * @param {Object} orderInfo - Order information
 * @returns {Object} Payment URL and order details
 */
export const createMoMoPayment = async (orderInfo) => {
  try {
    const {
      orderId,
      amount,
      orderInfo: orderDescription,
      returnUrl,
      notifyUrl
    } = orderInfo;

    // MoMo API credentials from .env
    const partnerCode = process.env.MOMO_PARTNER_CODE;
    const accessKey = process.env.MOMO_ACCESS_KEY;
    const secretKey = process.env.MOMO_SECRET_KEY;
    const endpoint = process.env.MOMO_ENDPOINT || 'https://test-payment.momo.vn/v2/gateway/api/create';

    // Request parameters
    const requestId = orderId;
    const requestType = 'captureWallet'; // or 'payWithATM' for bank transfer
    const extraData = ''; // Optional: additional data
    const orderGroupId = '';
    const autoCapture = true;
    const lang = 'vi';

    // Create signature
    // Format: accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$notifyUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$returnUrl&requestId=$requestId&requestType=$requestType
    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${notifyUrl}&orderId=${orderId}&orderInfo=${orderDescription}&partnerCode=${partnerCode}&redirectUrl=${returnUrl}&requestId=${requestId}&requestType=${requestType}`;

    const signature = crypto
      .createHmac('sha256', secretKey)
      .update(rawSignature)
      .digest('hex');

    // Request body
    const requestBody = {
      partnerCode,
      accessKey,
      requestId,
      amount,
      orderId,
      orderInfo: orderDescription,
      redirectUrl: returnUrl,
      ipnUrl: notifyUrl,
      requestType,
      extraData,
      lang,
      signature
    };

    // Call MoMo API
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();

    if (data.resultCode === 0) {
      // Success
      return {
        success: true,
        payUrl: data.payUrl,
        orderId: data.orderId,
        requestId: data.requestId
      };
    } else {
      // Error
      return {
        success: false,
        message: data.message || 'MoMo payment creation failed',
        resultCode: data.resultCode
      };
    }

  } catch (error) {
    console.error('MoMo payment error:', error);
    return {
      success: false,
      message: 'Failed to create MoMo payment',
      error: error.message
    };
  }
};

/**
 * Verify MoMo IPN (Instant Payment Notification) callback
 * @param {Object} callbackData - Data from MoMo callback
 * @returns {Boolean} Verification result
 */
export const verifyMoMoCallback = (callbackData) => {
  try {
    const {
      partnerCode,
      orderId,
      requestId,
      amount,
      orderInfo,
      orderType,
      transId,
      resultCode,
      message,
      payType,
      responseTime,
      extraData,
      signature
    } = callbackData;

    const secretKey = process.env.MOMO_SECRET_KEY;

    // Create signature for verification
    // Format: accessKey=$accessKey&amount=$amount&extraData=$extraData&message=$message&orderId=$orderId&orderInfo=$orderInfo&orderType=$orderType&partnerCode=$partnerCode&payType=$payType&requestId=$requestId&responseTime=$responseTime&resultCode=$resultCode&transId=$transId
    const rawSignature = `accessKey=${process.env.MOMO_ACCESS_KEY}&amount=${amount}&extraData=${extraData}&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&partnerCode=${partnerCode}&payType=${payType}&requestId=${requestId}&responseTime=${responseTime}&resultCode=${resultCode}&transId=${transId}`;

    const expectedSignature = crypto
      .createHmac('sha256', secretKey)
      .update(rawSignature)
      .digest('hex');

    // Verify signature
    if (signature === expectedSignature && resultCode === 0) {
      return {
        success: true,
        verified: true,
        transId,
        orderId
      };
    } else {
      return {
        success: false,
        verified: false,
        message: resultCode === 0 ? 'Invalid signature' : message
      };
    }

  } catch (error) {
    console.error('MoMo verification error:', error);
    return {
      success: false,
      verified: false,
      error: error.message
    };
  }
};

/**
 * Check MoMo transaction status
 * @param {String} orderId - Order ID
 * @returns {Object} Transaction status
 */
export const checkMoMoTransactionStatus = async (orderId) => {
  try {
    const partnerCode = process.env.MOMO_PARTNER_CODE;
    const accessKey = process.env.MOMO_ACCESS_KEY;
    const secretKey = process.env.MOMO_SECRET_KEY;
    const endpoint = process.env.MOMO_QUERY_ENDPOINT || 'https://test-payment.momo.vn/v2/gateway/api/query';

    const requestId = orderId + '_query';
    const lang = 'vi';

    // Create signature
    const rawSignature = `accessKey=${accessKey}&orderId=${orderId}&partnerCode=${partnerCode}&requestId=${requestId}`;
    const signature = crypto
      .createHmac('sha256', secretKey)
      .update(rawSignature)
      .digest('hex');

    const requestBody = {
      partnerCode,
      accessKey,
      requestId,
      orderId,
      lang,
      signature
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();

    return {
      success: data.resultCode === 0,
      resultCode: data.resultCode,
      message: data.message,
      transId: data.transId,
      amount: data.amount,
      payType: data.payType
    };

  } catch (error) {
    console.error('MoMo status check error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};
