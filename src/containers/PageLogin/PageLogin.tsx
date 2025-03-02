import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router";
import { userLogin } from "../../features/auth/authSlice";
import ButtonPrimary from "../../shared/Button/ButtonPrimary";
import Input from "../../shared/Input/Input";
import { AppDispatch } from "../../store";

export interface PageLoginProps {
  className?: string;
}

const PageLogin: FC<PageLoginProps> = ({ className = "" }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const onSubmit = async (data: any) => {
    try {
      await dispatch(userLogin({
        email: data.email,
        password: data.password
      })).unwrap();
      // load lại trang để cập nhật trạng thái đăng nhập
      navigate("/");
      window.location.reload();
      toast.success("Đăng nhập thành công");

    } catch (error) {
      console.error("Failed to login", error);
      toast.error("Đăng nhập thất bại");

    }

  };

  return (
    <div className={`nc-PageLogin ${className}`} data-nc-id="PageLogin">
      <title>Đăng nhập || fashionFactory React Template</title>
      <div className="container mb-24 lg:mb-32">
        <h2 className="my-20 flex items-center text-3xl leading-[115%] md:text-5xl md:leading-[115%] font-semibold text-neutral-900 dark:text-neutral-100 justify-center">
          Đăng nhập
        </h2>
        <div className="max-w-md mx-auto space-y-6">
          {/* FORM */}
          <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit(onSubmit)}>
            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                Địa chỉ email
              </span>
              <Input
                type="email"
                placeholder="example@example.com"
                className="mt-1"
                {...register("email", { required: "Email là bắt buộc" })}
              />
              {errors.email && <p className="text-red-500 text-sm">{String(errors.email.message)}</p>}
            </label>
            <label className="block">
              <span className="flex justify-between items-center text-neutral-800 dark:text-neutral-200">
                Mật khẩu
                <Link to="/forgot-pass" className="text-sm text-green-600">
                  Quên mật khẩu?
                </Link>
              </span>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  className="mt-1"
                  {...register("password", { required: "Mật khẩu là bắt buộc" })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm">{String(errors.password.message)}</p>}
            </label>
            <ButtonPrimary type="submit">Tiếp tục</ButtonPrimary>
          </form>
          {/* ==== */}
          <span className="block text-center text-neutral-700 dark:text-neutral-300">
            Người dùng mới? {` `}
            <Link className="text-green-600" to="/signup">
              Tạo tài khoản
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default PageLogin;
