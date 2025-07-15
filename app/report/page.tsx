// /app/report/page.tsx
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import axios from "axios";

export default function ReportPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!message) {
      toast.error("Vui lòng nhập nội dung góp ý hoặc báo lỗi");
      return;
    }

    setLoading(true);
    try {
      await axios.post("/api/report", {
        email,
        message,
      });
      toast.success("Gửi thành công! Cảm ơn bạn đã phản hồi.");
      setEmail("");
      setMessage("");
    } catch (err) {
      toast.error("Có lỗi xảy ra, vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-12 p-6 bg-white dark:bg-slate-900 rounded-lg shadow">
      <h1 className="text-xl font-bold text-center mb-4 text-slate-800 dark:text-white">
        Góp ý & Báo lỗi hệ thống
      </h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 text-center">
        Nếu bạn phát hiện lỗi hoặc có đề xuất cải tiến hệ thống, hãy chia sẻ tại đây.
      </p>

      <Input
        type="email"
        placeholder="Email liên hệ (không bắt buộc)"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-4"
      />
      <Textarea
        rows={6}
        placeholder="Nhập góp ý hoặc mô tả lỗi bạn gặp phải..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <Button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full mt-4"
      >
        {loading ? "Đang gửi..." : "Gửi phản hồi"}
      </Button>
    </div>
  );
}
