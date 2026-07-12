/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { z } from "zod";

const signupSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    repeatPassword: z.string().min(1, "Repeat password is required"),
    agreed: z.boolean().refine((val) => val === true, {
      message: "Please agree to terms & conditions",
    }),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: "Passwords do not match",
    path: ["repeatPassword"],
  });

const SignupPage = () => {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    repeatPassword?: string;
    agreed?: string;
  }>({});

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const validation = signupSchema.safeParse({
      firstName,
      lastName,
      email,
      password,
      repeatPassword,
      agreed,
    });

    if (!validation.success) {
      const formattedErrors: {
        firstName?: string;
        lastName?: string;
        email?: string;
        password?: string;
        repeatPassword?: string;
        agreed?: string;
      } = {};
      validation.error.issues.forEach((issue) => {
        const path = issue.path[0] as keyof typeof formattedErrors;
        if (path) {
          formattedErrors[path] = issue.message;
        }
      });
      setErrors(formattedErrors);

      const firstError = validation.error.issues[0]?.message || "Invalid input";
      toast.error(firstError);
      return;
    }

    const toastId = toast.loading("Registering...");
    setLoading(true);
    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5016/api/v1";
      const res = await fetch(`${apiUrl}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          fullName: `${firstName} ${lastName}`.trim(),
          email,
          password,
          logInProcess: "EMAIL",
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.loading("Registration successful! Logging in...", { id: toastId });
        try {
          const loginRes = await signIn("credentials", {
            email,
            password,
            redirect: false,
          });

          if (loginRes?.error) {
            toast.error(loginRes.error || "Login failed", { id: toastId });
          } else {
            toast.success("Login successful!", { id: toastId });
            router.push("/dashboard");
            router.refresh();
          }
        } catch (err: any) {
          toast.error(err.message || "An unexpected error occurred during login", { id: toastId });
        }
      } else {
        toast.error(data.message || "Registration failed", { id: toastId });
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred during registration", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const hasGoogleProvider = !!process.env.NEXT_PUBLIC_GOOGLE_ID;

  return (
    <section className="_social_registration_wrapper _layout_main_wrapper">
      <div className="_shape_one">
        <img src="/assets/images/shape1.svg" alt="" className="_shape_img" />
        <img
          src="/assets/images/dark_shape.svg"
          alt=""
          className="_dark_shape"
        />
      </div>
      <div className="_shape_two">
        <img src="/assets/images/shape2.svg" alt="" className="_shape_img" />
        <img
          src="/assets/images/dark_shape1.svg"
          alt=""
          className="_dark_shape _dark_shape_opacity"
        />
      </div>
      <div className="_shape_three">
        <img src="/assets/images/shape3.svg" alt="" className="_shape_img" />
        <img
          src="/assets/images/dark_shape2.svg"
          alt=""
          className="_dark_shape _dark_shape_opacity"
        />
      </div>
      <div className="_social_registration_wrap">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-xl-8 col-lg-8 col-md-12 col-sm-12">
              <div className="_social_registration_right">
                <div className="_social_registration_right_image">
                  <img src="/assets/images/registration.png" alt="Image" />
                </div>
                <div className="_social_registration_right_image_dark">
                  <img src="/assets/images/registration1.png" alt="Image" />
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12">
              <div className="_social_registration_content">
                <div className="_social_registration_right_logo _mar_b28">
                  <img
                    src="/assets/images/logo.svg"
                    alt="Image"
                    className="_right_logo"
                  />
                </div>
                <p className="_social_registration_content_para _mar_b8">
                  Get Started Now
                </p>
                <h4 className="_social_registration_content_title _titl4 _mar_b50">
                  Registration
                </h4>
                <button
                  type="button"
                  onClick={() =>
                    signIn("google", { callbackUrl: "/dashboard" })
                  }
                  className="_social_registration_content_btn _mar_b40"
                >
                  <img
                    src="/assets/images/google.svg"
                    alt="Image"
                    className="_google_img"
                  />{" "}
                  <span>Register with google</span>
                </button>
                <div className="_social_registration_content_bottom_txt _mar_b40">
                  {" "}
                  <span>Or</span>
                </div>
                <form
                  className="_social_registration_form"
                  onSubmit={handleRegister}
                >
                  <div className="row">
                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                      <div className="_social_registration_form_input _mar_b14">
                        <label className="_social_registration_label _mar_b8">
                          First Name
                        </label>
                        <input
                          type="text"
                          id="reg-firstName"
                          className="form-control _social_registration_input"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                        />
                        {errors.firstName && (
                          <span className="text-danger" style={{ fontSize: "12px", marginTop: "4px", display: "block" }}>
                            {errors.firstName}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                      <div className="_social_registration_form_input _mar_b14">
                        <label className="_social_registration_label _mar_b8">
                          Last Name
                        </label>
                        <input
                          type="text"
                          id="reg-lastName"
                          className="form-control _social_registration_input"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                        />
                        {errors.lastName && (
                          <span className="text-danger" style={{ fontSize: "12px", marginTop: "4px", display: "block" }}>
                            {errors.lastName}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                      <div className="_social_registration_form_input _mar_b14">
                        <label className="_social_registration_label _mar_b8">
                          Email
                        </label>
                        <input
                          type="email"
                          id="reg-email"
                          className="form-control _social_registration_input"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                        {errors.email && (
                          <span className="text-danger" style={{ fontSize: "12px", marginTop: "4px", display: "block" }}>
                            {errors.email}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                      <div className="_social_registration_form_input _mar_b14">
                        <label className="_social_registration_label _mar_b8">
                          Password
                        </label>
                        <input
                          type="password"
                          id="reg-password"
                          className="form-control _social_registration_input"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        {errors.password && (
                          <span className="text-danger" style={{ fontSize: "12px", marginTop: "4px", display: "block" }}>
                            {errors.password}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                      <div className="_social_registration_form_input _mar_b14">
                        <label className="_social_registration_label _mar_b8">
                          Repeat Password
                        </label>
                        <input
                          type="password"
                          id="reg-repeatPassword"
                          className="form-control _social_registration_input"
                          value={repeatPassword}
                          onChange={(e) => setRepeatPassword(e.target.value)}
                        />
                        {errors.repeatPassword && (
                          <span className="text-danger" style={{ fontSize: "12px", marginTop: "4px", display: "block" }}>
                            {errors.repeatPassword}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-12 col-xl-12 col-md-12 col-sm-12">
                      <div className="form-check _social_registration_form_check">
                        <input
                          className="form-check-input _social_registration_form_check_input"
                          type="radio"
                          name="flexRadioDefault"
                          id="reg-agree"
                          checked={agreed}
                          onChange={(e) => setAgreed(e.target.checked)}
                        />{" "}
                        <label
                          className="form-check-label _social_registration_form_check_label"
                          htmlFor="reg-agree"
                        >
                          I agree to terms &amp; conditions
                        </label>
                        {errors.agreed && (
                          <span className="text-danger" style={{ fontSize: "12px", marginTop: "4px", display: "block" }}>
                            {errors.agreed}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-12 col-md-12 col-xl-12 col-sm-12">
                      <div className="_social_registration_form_btn _mar_t40 _mar_b60">
                        <button
                          type="submit"
                          id="reg-submit"
                          className="_social_registration_form_btn_link _btn1"
                          style={{ padding: "12px 90px" }}
                          disabled={loading}
                        >
                          {loading ? "Registering..." : "Register now"}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
                <div className="row">
                  <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                    <div className="_social_registration_bottom_txt">
                      <p className="_social_registration_bottom_txt_para">
                        Already have an account?{" "}
                        <Link href="/auth/login">Login</Link>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignupPage;
