import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axiosClient from "../api/axiosClient";

const PurchasedApartments = () => {
  const { user } = useSelector((state) => state.auth);
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const response = await axiosClient.get("/contracts/my-contracts");
        if (response.data.success) {
          setContracts(response.data.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Không thể tải danh sách căn hộ.");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchContracts();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 font-medium">Vui lòng đăng nhập để xem thông tin này.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-2xl border border-gray-100">
            🏢
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Căn Hộ Đã Thanh Toán</h2>
            <p className="text-sm text-slate-500 font-medium">Danh sách các căn hộ bạn đã đặt cọc hoặc sở hữu</p>
          </div>
        </div>

        {error && (
          <div className="p-4 mb-6 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-sm font-medium">
            {error}
          </div>
        )}

        {contracts.length === 0 && !error ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100">
            <span className="text-4xl block mb-4">🏠</span>
            <h3 className="text-lg font-bold text-gray-800">Bạn chưa thanh toán căn hộ nào</h3>
            <p className="text-gray-500 text-sm mt-2">Hãy tham khảo các căn hộ đang bán và tiến hành đặt cọc.</p>
            <Link to="/" className="mt-6 inline-block bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition">
              Xem danh sách căn hộ
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {contracts.map((contract) => {
              const apt = contract.apartmentId || {};
              return (
                <div key={contract._id} className="bg-white/80 backdrop-blur-md rounded-3xl shadow-lg border border-white p-6 flex flex-col md:flex-row gap-6 transition hover:shadow-xl">
                  <div className="relative">
                    <img
                      src={apt.images?.[0] || "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800"}
                      alt={apt.title}
                      className="w-full md:w-48 h-36 object-cover rounded-2xl shadow-md"
                    />
                    <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-lg">
                      {contract.paymentStatus}
                    </div>
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-slate-800">{apt.title || "Căn hộ chưa rõ"}</h3>
                      <Link 
                        to="/resident-dashboard" 
                        className="text-xs font-bold bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg hover:bg-blue-200 transition"
                      >
                        Bảng điều khiển ➔
                      </Link>
                    </div>
                    
                    <p className="text-xs text-slate-400 mb-4 font-mono">Mã HĐ: {contract._id}</p>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm border-t border-slate-100 pt-4">
                      <div>
                        <span className="text-slate-500 block text-xs">Tổng tiền cọc</span>
                        <span className="font-bold text-indigo-600">{(contract.totalAmount || 0).toLocaleString()} VNĐ</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-xs">Ngày nhận phòng</span>
                        <span className="font-bold text-slate-700">{new Date(contract.checkInDate).toLocaleDateString("vi-VN")}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-xs">Phương thức thanh toán</span>
                        <span className="font-bold text-slate-700">{contract.paymentMethod === 'DIRECT_CASH' ? 'Tiền mặt' : 'Chuyển khoản / VNPay'}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-xs">Dịch vụ đính kèm</span>
                        <div className="flex gap-1 mt-1">
                          {contract.cleaningService?.isRegistered && <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-md font-bold">Dọn dẹp</span>}
                          {contract.smartHomeService?.isRegistered && <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-md font-bold">SmartHome</span>}
                          {!contract.cleaningService?.isRegistered && !contract.smartHomeService?.isRegistered && <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md">Không</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PurchasedApartments;
