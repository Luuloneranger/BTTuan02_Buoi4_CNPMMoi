import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchByCategoryLazyThunk,
  clearLazyList,
} from "../store/apartmentSlice";
import { Link } from "react-router-dom";

const CategoryLazyLoad = () => {
  const dispatch = useDispatch();
  const {
    lazyList: apartments,
    hasMore,
    isLoading,
  } = useSelector((state) => state.apartments);

  const [page, setPage] = useState(1);
  const currentCategoryId = "6645a1b2c3d4e5f6a7b8c901";
  const observerTarget = useRef(null);

  useEffect(() => {
    dispatch(clearLazyList());
    setPage(1);
  }, [currentCategoryId, dispatch]);

  useEffect(() => {
    dispatch(
      fetchByCategoryLazyThunk({
        categoryId: currentCategoryId,
        page,
        limit: 3,
      }),
    );
  }, [currentCategoryId, page, dispatch]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      { threshold: 1.0 },
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) observer.unobserve(observerTarget.current);
    };
  }, [hasMore, isLoading]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-xl font-bold text-gray-800 mb-6">
        🏢 Danh Sách Căn Hộ Theo Phân Khu (Lazy Loading)
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {apartments.map((apt, index) => (
          <Link
            to={`/apartments/${apt._id}`}
            key={`${apt._id}-${index}`}
            className="bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition"
          >
            <img
              src={apt.images?.[0]}
              alt=""
              className="w-full h-44 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold text-gray-800 text-sm truncate">
                {apt.title}
              </h3>
              <p className="text-blue-600 font-bold text-sm mt-1">
                {apt.price?.toLocaleString()} VNĐ
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Diện tích: {apt.features?.area}m² | Giường:{" "}
                {apt.features?.bedrooms}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* CHIẾC GỜ GIÁM SÁT ẨN - Nơi kích hoạt Lazy Load */}
      <div
        ref={observerTarget}
        className="h-12 flex items-center justify-center mt-6"
      >
        {isLoading && (
          <p className="text-xs text-blue-500 font-medium animate-pulse">
            🔄 Đang tải thêm căn hộ mới...
          </p>
        )}
        {!hasMore && apartments.length > 0 && (
          <p className="text-xs text-gray-400 font-medium">
            ✨ Đã hiển thị toàn bộ căn hộ thuộc danh mục này.
          </p>
        )}
      </div>
    </div>
  );
};

export default CategoryLazyLoad;
