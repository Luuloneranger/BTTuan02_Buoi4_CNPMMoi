import React, { useState } from "react";

const ResidentDashboard = () => {
  // Giả định dữ liệu lấy từ bảng Contract sau khi đã kích hoạt thành công
  const [contractData, setContractData] = useState({
    apartmentNumber: "Room 12.05 - Block A",
    cleaningService: {
      isRegistered: true, // Thử đổi thành false để xem giao diện tự động ẩn đi
      stepStatus: "DEEP_CLEANING", // Các bước: COLLECTING_WASTE -> DEEP_CLEANING -> DONE
    },
    smartHomeService: {
      isRegistered: true,
      activationStatus: "ACTIVATED",
    },
  });

  // Mảng định nghĩa các bước của thanh tiến độ dọn dẹp (Yêu cầu 3)
  const cleaningSteps = [
    { key: "COLLECTING_WASTE", label: "Dọn rác thô", icon: "🗑️" },
    { key: "DEEP_CLEANING", label: "Lau dọn chuyên sâu", icon: "✨" },
    { key: "DONE", label: "Sẵn sàng bàn giao", icon: "🔑" },
  ];

  const currentStepIndex = cleaningSteps.findIndex(
    (step) => step.key === contractData.cleaningService.stepStatus,
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-md flex justify-between items-center">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-blue-400">
            Cổng cư dân số
          </span>
          <h2 className="text-lg font-black mt-1">
            🏢 Không Gian Quản Trị: {contractData.apartmentNumber}
          </h2>
        </div>
        <span className="text-xs bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-1 rounded-full font-bold">
          ● Đã nhận bàn giao
        </span>
      </div>

      {/* ─── YÊU CẦU 3: THANH TIẾN ĐỘ DỌN DẸP PHÒNG MỚI ─── */}
      {contractData.cleaningService.isRegistered ? (
        <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b pb-3">
            <h3 className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
              🧹 Tiến Độ Chuẩn Bị & Dọn Dẹp Căn Hộ
            </h3>
            <span className="text-xs text-blue-600 font-bold bg-blue-5 text-blue-600 px-2 py-0.5 rounded">
              Gói dịch vụ đã chọn
            </span>
          </div>

          {/* Stepper UI của Tailwind */}
          <div className="flex items-center justify-between relative max-w-3xl mx-auto py-4">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-100 z-0"></div>

            {cleaningSteps.map((step, index) => {
              const isActive = index <= currentStepIndex;
              return (
                <div
                  key={step.key}
                  className="flex flex-col items-center relative z-10 flex-1"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                      isActive
                        ? "bg-blue-600 text-white ring-4 ring-blue-100 shadow"
                        : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    {step.icon}
                  </div>
                  <span
                    className={`text-xs mt-2 font-semibold ${isActive ? "text-blue-600" : "text-gray-400"}`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 p-4 rounded-xl text-xs text-gray-400 text-center border border-dashed">
          ℹ️ Bạn không đăng ký dịch vụ dọn dẹp chuyên sâu. Căn hộ bàn giao theo
          tiêu chuẩn mặc định.
        </div>
      )}

      {/* ─── YÊU CẦU 4: KHU VỰC ĐĂNG KÝ GÓI NHÀ THÔNG MINH TRỌN ĐỜI ─── */}
      <div className="bg-white border rounded-2xl p-6 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <div className="md:col-span-2 space-y-2">
          <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
            ⚡ Hệ Thống Gói SmartHome Trọn Đời
            <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-md font-bold">
              Mua 1 lần dùng vĩnh viễn
            </span>
          </h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            Kích hoạt toàn bộ hệ thống cảm biến dòng điện, điều khiển công tắc
            đèn thông minh và bộ Trợ lý điều khiển bằng giọng nói tiếng Việt
            trực tiếp trên hệ thống Web/App tòa nhà.
          </p>
        </div>

        <div className="text-right border-l pl-6 flex flex-col items-end justify-center">
          {contractData.smartHomeService.isRegistered &&
          contractData.smartHomeService.activationStatus === "ACTIVATED" ? (
            <div className="space-y-2 w-full text-center">
              <span className="inline-block w-full text-xs text-center bg-purple-50 text-purple-700 font-bold border border-purple-200 py-2 rounded-xl animate-pulse">
                🟢 ĐÃ KÍCH HOẠT HỆ THỐNG
              </span>
              {/* NÚT BẤM DẪN SANG TRANG DIỀU KHIỂN THIẾT BỊ THỰC TẾ (SẼ LÀM Ở GIAI ĐOẠN IOT) */}
              <button className="w-full text-[11px] bg-slate-800 text-white font-bold py-2 rounded-xl hover:bg-slate-700 transition">
                Truy cập bảng điều khiển IoT ➔
              </button>
            </div>
          ) : (
            <button className="w-full text-xs bg-blue-600 text-white font-bold py-2.5 px-4 rounded-xl hover:bg-blue-700 shadow-sm transition">
              Đăng ký kích hoạt gói (2.500.000đ)
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResidentDashboard;
