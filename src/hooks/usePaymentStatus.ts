"use client";

import { useState, useRef } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { getDjangoAuthUrl } from "@/lib/utils";

export const usePaymentStatus = () => {
  const [paymentStatus, setPaymentStatus] = useState('LOADING');
  const [orderId, setOrderId] = useState('');
  const [amount, setAmount] = useState('');
  const timeoutId = useRef<NodeJS.Timeout | null>(null);
  const pollStartTime = useRef<number | null>(null);

  const checkPaymentStatus = async (signal?: AbortSignal) => {
    const orderIdFromStorage = typeof window !== 'undefined' 
      ? localStorage.getItem('order_id') 
      : null;
    
    if (!orderIdFromStorage) {
      setPaymentStatus('FAILED');
      return;
    }

    // Track start time across recursive polling calls
    if (pollStartTime.current === null) {
      pollStartTime.current = Date.now();
    }

    try {
      // Stop polling after 5 minutes
      if (Date.now() - pollStartTime.current >= 5 * 60 * 1000) {
        setPaymentStatus("WAITING");
        if (typeof window !== 'undefined') {
          localStorage.removeItem('order_id');
          localStorage.removeItem('tier_id');
        }
        if (timeoutId.current) {
          clearTimeout(timeoutId.current);
        }
        pollStartTime.current = null;
        return;
      }

      const apiUrl = getDjangoAuthUrl();
      const jwtToken = Cookies.get("jwt_Token");
      
      if (!jwtToken) {
        setPaymentStatus('FAILED');
        return;
      }

      const response = await axios.get(
        `${apiUrl}/subscriptions/payment-status/${orderIdFromStorage}/`,
        {
          headers: { Authorization: `Bearer ${jwtToken}` },
          signal,
        }
      );

      if (response.data.status === "CHARGED") {
        setPaymentStatus("SUCCESS");
        setAmount(response.data.amount);
        setOrderId(response.data.order_id);
        if (typeof window !== 'undefined') {
          localStorage.removeItem('order_id');
          localStorage.removeItem('tier_id');
        }
        pollStartTime.current = null;
        return;
      }

      if (
        response.data.status === "AUTHENTICATION_FAILED" ||
        response.data.status === "AUTHORIZATION_FAILED"
      ) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('order_id');
          localStorage.removeItem('tier_id');
        }
        pollStartTime.current = null;
        setPaymentStatus("FAILED");
        return;
      }

      // Continue polling if payment not yet completed
      if (response.data.status !== "CHARGED") {
        timeoutId.current = setTimeout(() => checkPaymentStatus(signal), 10 * 1000);
      }

    } catch (err: any) {
      if (axios.isCancel(err)) {
        console.log("Payment status request canceled");
      } else {
        console.error("Payment status check error:", err);
        timeoutId.current = setTimeout(() => checkPaymentStatus(signal), 10 * 1000);
      }
    }
  };

  const clearPolling = () => {
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
      timeoutId.current = null;
    }
    pollStartTime.current = null;
  };

  return { 
    checkPaymentStatus, 
    paymentStatus, 
    orderId, 
    amount, 
    timeoutId,
    clearPolling 
  };
};