"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { getDjangoAuthUrl } from "@/lib/utils";

export const useTeacherSubscription = () => {
  const [loading, setLoading] = useState(false);
  const [loadingPlanId, setLoadingPlanId] = useState<number | null>(null);
  const [subscriptionDetail, setSubscriptionDetail] = useState([]);

  const getSubscriptions = async () => {
    try {
      setLoading(true);
      const djangoUrl = getDjangoAuthUrl();

      // Django API doesn't require authentication for listing plans
      const response = await axios.get(`${djangoUrl}/subscriptions/`);
      
      setSubscriptionDetail(response.data.plans);
    } catch (err: any) {
      console.error("Get subscriptions error:", err);
      toast.error(err.response?.data?.message || "Failed to fetch subscription plans");
    } finally {
      setLoading(false);
    }
  };

  const startPayment = async (tierId: number, duration: number) => {
    try {
      setLoadingPlanId(tierId);
      const djangoUrl = getDjangoAuthUrl();
      const jwtToken = Cookies.get("jwt_Token");
      
      if (!jwtToken) {
        toast.error("Authentication required. Please login again.");
        setLoadingPlanId(null);
        return;
      }

      const response = await axios.post(`${djangoUrl}/subscriptions/start-payment/`, {
        sub_id: tierId,
        duration: duration
      }, { 
        headers: { Authorization: `Bearer ${jwtToken}` } 
      });

      // Store order details for payment verification
      if (typeof window !== 'undefined') {
        localStorage.setItem('order_id', response.data.order_id);
        localStorage.setItem('tier_id', tierId.toString());
        localStorage.setItem('subscription_name', response.data.subscription);
        localStorage.setItem('amount', response.data.amount.toString());
      }

      // Redirect to payment gateway
      const paymentUrl = response.data.payment_url;
      window.location.href = paymentUrl;
      
    } catch (err: any) {
      console.error("Payment start error:", err);
      toast.error(err.response?.data?.message || "Failed to start payment process");
      setLoadingPlanId(null);
    }
  };

  return { 
    getSubscriptions, 
    subscriptionDetail, 
    startPayment, 
    loading,
    loadingPlanId
  };
};