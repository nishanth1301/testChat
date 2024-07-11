import { useState } from "react";
import * as Yup from "yup";
import "./login.css";
import { useSpring, animated } from "react-spring";
import { useNavigate } from "react-router-dom";
import { Field, FormikProvider, useFormik } from "formik";
import { useAuthentication } from "../../context/AuthProvider";

export const Login = () => {
  const fadeIn = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    config: { duration: 1000 },
  });
  const [showPassword, setShowPassword] = useState(false);
  const validationSchema = Yup.object().shape({
    email: Yup.string().trim().required("Provide valid user name"),
    password: Yup.string()
      .trim()
      .required("Password is required")
      .min(8, "Password is too short- should be 8 characters  minimum")
      .matches(/^(?=.{6,})/, "Must Contain 6 Characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])/,
        "Must Contain One Uppercase, One Lowercase"
      )
      .matches(
        /^(?=.*?[!"#$%&'()*+,-./:;<=>?@_`{}~])/,
        "Must Contain One Special Case Character"
      ),
  });
  const context: any = useAuthentication();
  const navigate = useNavigate();

  const initialValues = {
    email: "",
    password: "",
  };
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: async (item) => {
      const response = await context.login(item);
      console.log(response,'kkk')
      if (response.success) {
        navigate("/chat");
      }
    },
  });

  const { values, isSubmitting, handleSubmit, errors } = formik;
  const isButtonDisabled = !values.email || !values.password;
  const generateStars = () => {
    let stars = [];
    for (let i = 0; i < 50; i++) {
      stars.push(
        <div
          className="star"
          key={i}
          style={{
            top: `${Math.floor(Math.random() * 100)}%`,
            left: `${Math.floor(Math.random() * 100)}%`,
          }}
        />
      );
    }
    return stars;
  };
  return (
    <div className="login-form-component-root galaxy">
      {generateStars()}
      <animated.div style={fadeIn}>
        <div className="form-container">
          <FormikProvider value={formik}>
            <form onSubmit={handleSubmit}>
              <div className="mb-4 text-start loginForm">
                <Field
                  name="email"
                  placeholder="email"
                  type="email"
                  className="form-control"
                />
              </div>
              <div className="mb-3 text-start loginForm ">
                <div className="position-relative mt-3">
                  <Field
                    name="password"
                    placeholder="Password"
                    type="password"
                    autoFocus
                    className="form-control"
                  />
                </div>
              </div>
              <div className="d-flex justify-content-between pb-3 pt-3">
                <div className="mb-3 form-check">
                  {/* <CustomCheckbox
              name="remember_me"
              validationSchema={validationSchema}
              label="Remember me"
              errors={errors}
              type={"checkbox"}
            /> */}
                </div>
                {/* <div
                  style={{
                    cursor: "pointer",
                    fontSize: "12px",
                    fontWeight: 500,
                  }}
                  className="text-primary form-check-redirect"
                >
                  I forgot my password
                </div> */}
              </div>
              <button
                data-testid="submit"
                type="submit"
                className={`login-btn`}
                disabled={isSubmitting || isButtonDisabled}
              >
                <h6 className="fw-semibold m-0">Login</h6>
              </button>
            </form>
          </FormikProvider>
        </div>
      </animated.div>
    </div>
  );
};
