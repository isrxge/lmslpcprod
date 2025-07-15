export default function PoliciesPage() {
  return (
    <div className="max-w-3xl mx-auto py-10 px-4 space-y-6 text-justify text-gray-800 dark:text-slate-200">
      <h1 className="text-2xl font-bold text-center">Chính sách học và thi</h1>

      <section>
        <h2 className="font-semibold text-lg text-blue-600">I. Chính sách học tập</h2>
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li>Người học cần hoàn thành tất cả các module trước ngày kết thúc khóa học.</li>
          <li>Hệ thống ghi nhận hoàn thành khi người học đạt trạng thái "Hoàn thành".</li>
          <li>Không hoàn thành đúng hạn sẽ không được cấp chứng nhận.</li>
        </ul>
      </section>

      <section>
        <h2 className="font-semibold text-lg text-blue-600">II. Chính sách thi cử</h2>
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li>Mỗi học viên chỉ được thi 1 lần duy nhất.</li>
          <li>Kết thúc bài thi khi hết giờ hoặc người học nộp bài.</li>
          <li>Không được làm bài lại nếu đã vượt qua.</li>
        </ul>
      </section>

      <section>
        <h2 className="font-semibold text-lg text-blue-600">III. Vi phạm và xử lý</h2>
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li>Sao chép nội dung bài thi sẽ bị hủy kết quả.</li>
          <li>Đăng nhập hộ người khác có thể bị khóa tài khoản 7 ngày.</li>
          <li>Vi phạm nhiều lần sẽ bị cấm học trong 3 tháng.</li>
        </ul>
      </section>

      <section>
        <h2 className="font-semibold text-lg text-blue-600">IV. Hỗ trợ</h2>
        <p className="mt-2">
          Mọi thắc mắc vui lòng liên hệ bộ phận LMS qua email: 
          <a href="mailto:support@lp.com.vn" className="text-blue-500 ml-1 underline">support@lp.com.vn</a>
        </p>
      </section>
    </div>
  );
}
