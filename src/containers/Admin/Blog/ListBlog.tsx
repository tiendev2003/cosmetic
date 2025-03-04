import { Dialog, Transition } from '@headlessui/react';
import { EyeIcon, PencilSquareIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { debounce } from 'lodash';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router';
import { deleteBlog, fetchBlogs } from '../../../features/blog/blogSlice';
import { AppDispatch, RootState } from '../../../store';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const ListBlog = () => {
  const dispatch: AppDispatch = useDispatch();
  const { blogs, loading, error, pagination } = useSelector((state: RootState) => state.blogs);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBlogId, setSelectedBlogId] = useState<number | null>(null);
  const [searchTitle, setSearchTitle] = useState<string>('');
  const [pageSize, setPageSize] = useState<number>(5);

  useEffect(() => {
    dispatch(fetchBlogs({ page: 1, search: searchTitle, size: pageSize }));
  }, [dispatch, searchTitle, pageSize]);

  const openDeleteModal = (id: number) => {
    setSelectedBlogId(id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setSelectedBlogId(null);
    setIsDeleteModalOpen(false);
  };

  const handleDelete = async () => {
    if (selectedBlogId !== null) {
      try {
        await dispatch(deleteBlog(selectedBlogId)).unwrap();
        toast.success('Deleted blog successfully!');
        closeDeleteModal();
      } catch (error) {
        console.error(error);
        toast.error('Failed to delete blog!');
      }
    }
  };

  const handlePageChange = (page: number) => {
    dispatch(fetchBlogs({ page, search: searchTitle }));
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = parseInt(e.target.value);
    setPageSize(newSize);
    dispatch(fetchBlogs({ page: 1, search: searchTitle }));
  };

  const debouncedSearch = debounce((value: string) => {
    dispatch(fetchBlogs({ page: 1, search: value }));
  }, 300);

  const handleSearchTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTitle(value);
    debouncedSearch(value);
  };
  if (loading) {
    return <div className="p-6">Đang tải dữ liệu...</div>;
  }
  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }
  if (blogs.length === 0) {
    return <div className="p-6 text-gray-500">No blogs found.</div>;
  }
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Blog List</h1>
        <NavLink
          to="/admin/blog/add"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Add New Blog
        </NavLink>
      </div>

      {/* Search by Title */}
      <div className="mb-6">
        <label htmlFor="titleSearch" className="block text-sm font-medium text-gray-700">
          Search by Title
        </label>
        <input
          type="text"
          id="titleSearch"
          value={searchTitle}
          onChange={handleSearchTitle}
          placeholder="Enter blog title..."
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created At
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                  {error}
                </td>
              </tr>
            ) : blogs.length > 0 ? (
              blogs.map((blog) => (
                <tr key={blog.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {blog.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{blog?.category?.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{blog.createdDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={classNames(
                        blog.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800',
                        'px-2 inline-flex text-xs leading-5 font-semibold rounded-full'
                      )}
                    >
                      {blog.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <NavLink
                        to={`/admin/blog/view/${blog.id}`}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="View"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </NavLink>
                      <NavLink
                        to={`/admin/blog/edit/${blog.id}`}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Edit"
                      >
                        <PencilSquareIcon className="h-5 w-5" />
                      </NavLink>
                      <button
                        onClick={() => openDeleteModal(blog.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                  No blogs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-between items-center flex-wrap gap-3">
        <div className="flex items-center space-x-4">
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{blogs.length}</span> of{' '}
            <span className="font-medium">{pagination?.totalItems}</span> items
          </p>
          <div className="flex items-center">
            <label htmlFor="pageSize" className="text-sm text-gray-700 mr-2">
              Items per page:
            </label>
            <select
              id="pageSize"
              value={pageSize}
              onChange={handlePageSizeChange}
              className="rounded-md border-gray-300 text-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
            </select>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => handlePageChange((pagination?.currentPage || 1) - 1)}
            disabled={pagination?.currentPage === 0}
            className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
          >
            Trước
          </button>
          {Array.from({ length: pagination?.totalPages || 1 }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={classNames(
                pagination?.currentPage === page - 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700',
                'px-3 py-1 rounded-md hover:bg-indigo-500 hover:text-white'
              )}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => handlePageChange((pagination?.currentPage || 1) + 1)}
            disabled={(pagination?.currentPage ?? 0) + 1 === pagination?.totalPages}
            className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
          >
            Sau
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Transition show={isDeleteModalOpen} as="div">
        <Dialog as="div" className="relative z-10" onClose={closeDeleteModal}>
          <Transition.Child
            as="div"
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
              <Transition.Child
                as="div"
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                    <button
                      type="button"
                      className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                      onClick={closeDeleteModal}
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>
                  <div>
                    <div className="mt-3 text-center sm:mt-0 sm:text-left">
                      <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                        Delete Blog
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Are you sure you want to delete this blog? This action cannot be undone.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                      onClick={handleDelete}
                    >
                      Delete
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      onClick={closeDeleteModal}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}

export default ListBlog;