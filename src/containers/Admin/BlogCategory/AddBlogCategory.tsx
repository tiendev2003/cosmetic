import { FormEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate, useParams } from 'react-router';
import { addBlogCategory, fetchBlogCategoryById, updateBlogCategory } from '../../../features/blogCategory/blogCategorySlice';
import { AppDispatch, RootState } from '../../../store';
import { BlogCategory } from '../../../types';

const AddBlogCategory = () => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const { id } = useParams<{ id: string }>();
  const { category, loading, error } = useSelector((state: RootState) => state.blogCategories);

  // State cho form
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    if (id) {
      dispatch(fetchBlogCategoryById(Number(id))).then((action) => {
        if (fetchBlogCategoryById.fulfilled.match(action)) {
          const category = action.payload;
          setFormData({
            name: category.name,
            description: category.description,
          });
        }
      });
    }
  }, [id, dispatch]);

  // Xử lý thay đổi input
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Xử lý submit form
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const newBlogCategory: BlogCategory = {
        id: category ? category.id : Date.now(),
        name: formData.name,
        description: formData.description,
        createdDate: category ? category.createdDate : new Date().toISOString(),
        updatedDate: new Date().toISOString(),
      };

      if (category?.id) {
        await dispatch(updateBlogCategory(newBlogCategory)).unwrap();
        toast.success('Cập nhật danh mục blog thành công');
      } else {
        await dispatch(addBlogCategory(newBlogCategory)).unwrap();
        toast.success('Thêm danh mục blog thành công');
      }
      navigate('/admin/blog-category');
    } catch (error) {
      console.log('Failed to save blog category:', error);
      toast.error('Có lỗi xảy ra khi lưu danh mục blog');
    }
  };

  return (
    <div className="p-6  mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{
          category ? `Chỉnh danh mục blog: ${category.name}` : 'Thêm danh mục blog'
        }</h1>
        <NavLink
          to="/admin/blog-categories"
          className="text-indigo-600 hover:text-indigo-900 flex items-center"
        >
          <span className="mr-2">Quay lại danh sách Danh mục Blog</span>
        </NavLink>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Tên
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Mô tả
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-3">
          <NavLink
            to="/admin/blog-category"
            className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            Hủy
          </NavLink>
          <button
            type="submit"
            className="inline-flex justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
          >
            Lưu Danh mục Blog
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddBlogCategory;