"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

export const PoliciesModal = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-hidden rounded-2xl shadow-xl border border-gray-200">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-blue-800 flex items-center gap-2">
            📘 Chính sách học tập & thi cử
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[62vh] pr-2">
          <div className="space-y-6 text-[15px] leading-7 text-gray-700 px-1">
            <section>
              <h2 className="text-lg font-medium text-blue-700 mb-1">
                1. Quy định truy cập hệ thống
              </h2>
              <p>
                Hệ thống đào tạo nội bộ chỉ cho phép truy cập trong mạng nội bộ
                tại văn phòng công ty. Người dùng không thể truy cập từ bên
                ngoài (như tại nhà hoặc mạng công cộng).
              </p>
            </section>

            <section>
              <h2 className="text-lg font-medium text-blue-700 mb-1">
                2. Chính sách học tập
              </h2>
              <p>
                Nhân viên cần hoàn thành đầy đủ nội dung học và tham gia các
                hoạt động bắt buộc của khóa học. Việc không hoàn thành có thể
                ảnh hưởng đến kết quả cuối cùng hoặc quyền được cấp chứng nhận.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-medium text-blue-700 mb-1">
                3. Chính sách thi cử
              </h2>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  Bài thi tổ chức trực tuyến, chỉ thực hiện{" "}
                  <strong>một lần duy nhất</strong>.
                </li>
                <li>
                  Điểm đạt yêu cầu là từ <strong>80% trở lên</strong>.
                </li>
                <li>
                  Thời gian làm bài thi sẽ được người tạo khóa học thiết lập cụ
                  thể.
                </li>
                <li>
                  Phát hiện gian lận sẽ dẫn đến hủy kết quả và tạm ngưng quyền
                  truy cập hệ thống.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-medium text-blue-700 mb-1">
                4. Thi lại & thời gian chờ
              </h2>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  <strong>Nhân viên thử việc:</strong> Nếu không đạt, phải chờ
                  tối thiểu <strong>3 ngày</strong> để thi lại. Việc thi lại chỉ
                  được thực hiện nếu người hướng dẫn tạo khóa học mới tương ứng.
                </li>
                <li>
                  <strong>Nhân viên chính thức:</strong> Nếu không đạt, thời
                  gian chờ là <strong>7 ngày</strong>. Việc thi lại cũng phụ
                  thuộc vào sự có mặt của khóa học mới do người hướng dẫn cung
                  cấp.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-medium text-blue-700 mb-1">
                5. Chính sách đánh giá
              </h2>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  Hoàn thành tất cả nội dung và bài kiểm tra trong khóa học
                </li>
                <li>Điểm số từ bài thi cuối khóa</li>
                <li>Phản hồi và đánh giá từ giảng viên hướng dẫn</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-medium text-blue-700 mb-1">
                6. Hỗ trợ & liên hệ
              </h2>
              <p>
                Nếu có bất kỳ thắc mắc hoặc cần hỗ trợ, vui lòng gửi về địa chỉ:{" "}
                <a
                  href="mailto:khoa.nguyendang@lp.com.vn"
                  className="text-blue-600 underline font-medium"
                >
                  khoa.nguyendang@lp.com.vn
                </a>
              </p>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
