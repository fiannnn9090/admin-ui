import { ErrorMessage, Field, Form, Formik } from "formik";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import Button from "../Elements/Button.jsx";
import CheckBox from "../Elements/CheckBox.jsx";
import LabeledInput from "../Elements/LabeledInput.jsx";

const SignUpSchema = Yup.object().shape({
  email: Yup.string().email("Email tidak valid").required("Email wajib diisi"),
  name: Yup.string().required("Name wajib diisi"),
  password: Yup.string().required("Password wajib diisi"),
  terms: Yup.boolean().oneOf(
    [true],
    "Terms and privacy policy wajib disetujui",
  ),
});

function FormSignUp({ errorMessage, onSubmit }) {
  return (
    <>
      <Formik
        initialValues={{ email: "", name: "", password: "", terms: false }}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            await onSubmit({
              email: values.email,
              name: values.name,
              password: values.password,
              terms: values.terms,
            });
          } finally {
            setSubmitting(false);
          }
        }}
        validationSchema={SignUpSchema}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-5" noValidate>
            <div>
              <Field name="name">
                {({ field }) => (
                  <LabeledInput
                    {...field}
                    autoComplete="name"
                    id="name"
                    label="Full name"
                    placeholder="Tanzir Rahman"
                  />
                )}
              </Field>
              <ErrorMessage
                className="mt-2 text-sm text-red-600"
                component="p"
                name="name"
              />
            </div>

            <div>
              <Field name="email">
                {({ field }) => (
                  <LabeledInput
                    {...field}
                    autoComplete="email"
                    id="signup-email"
                    label="Email address"
                    placeholder="hello@example.com"
                    type="email"
                  />
                )}
              </Field>
              <ErrorMessage
                className="mt-2 text-sm text-red-600"
                component="p"
                name="email"
              />
            </div>

            <div>
              <Field name="password">
                {({ field }) => (
                  <LabeledInput
                    {...field}
                    autoComplete="new-password"
                    id="signup-password"
                    label="Password"
                    placeholder="********"
                    type="password"
                  />
                )}
              </Field>
              <ErrorMessage
                className="mt-2 text-sm text-red-600"
                component="p"
                name="password"
              />
            </div>

            <div>
              <Field name="terms">
                {({ field }) => (
                  <CheckBox
                    checked={field.value}
                    id="terms"
                    label="I agree to the terms and privacy policy"
                    name={field.name}
                    onChange={field.onChange}
                  />
                )}
              </Field>
              <ErrorMessage
                className="mt-2 text-sm text-red-600"
                component="p"
                name="terms"
              />
            </div>

            {errorMessage && (
              <p className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {errorMessage}
              </p>
            )}

            <Button disabled={isSubmitting}>
              {isSubmitting ? "Loading..." : "Create account"}
            </Button>
          </Form>
        )}
      </Formik>

      <div className="mt-8 text-center">
        <Link to="/login" className="text-sm font-semibold text-teal-600">
          Back to login
        </Link>
      </div>
    </>
  );
}

export default FormSignUp;
