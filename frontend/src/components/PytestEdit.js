import React from "react";
import { Box, MenuItem, TextField, Button } from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

// Helper function to validate JSON
const isValidJson = (value) => {
  try {
    JSON.parse(value);
    return true;
  } catch (e) {
    return false;
  }
};

// Validation schema for the form
const validationSchema = Yup.object().shape({
  endpoint: Yup.string().required("Endpoint is required"),
  method: Yup.string()
    .oneOf(["GET", "POST", "PUT", "DELETE"], "Invalid HTTP method")
    .required("HTTP method is required"),
  statusCode: Yup.number()
    .typeError("Status code must be a number")
    .required("Status code is required"),
  timeout: Yup.number()
    .typeError("Timeout must be a number")
    .required("Timeout is required"),
  headers: Yup.string()
    .test("is-json", "Headers must be a valid JSON object", (value) =>
      !value ? true : isValidJson(value)
    )
    .required("Headers are required"),
  payload: Yup.string().when("method", (method, schema) => {
    const [singleMethod] = method;
    if (singleMethod === "POST" || singleMethod === "PUT") {
      return schema
        .test(
          "is-json",
          "Payload must be a valid JSON object",
          (value) => !value || isValidJson(value)
        )
        .required("Payload is required for POST/PUT operations");
    }
    return schema.notRequired();
  }),
  response: Yup.string()
    .test("is-json", "Response must be a valid JSON object", (value) =>
      !value ? true : isValidJson(value)
    )
    .required("Response is required for POST/PUT operations"),
});

const PytestEdit = ({ initialValues, handleSubmit }) => {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}>
      {({ values, errors, touched, handleChange }) => (
        <Form>
          {/* Endpoint and HTTP Method */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              px: 2,
            }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                gap: 2,
              }}>
              <Field
                name="endpoint"
                as={TextField}
                label="URL Endpoint"
                fullWidth
                error={touched.endpoint && !!errors.endpoint}
                helperText={touched.endpoint && errors.endpoint}
              />
              <Field
                name="method"
                as={TextField}
                select
                label="Method"
                fullWidth
                value={values.method}
                onChange={handleChange}
                error={touched.method && !!errors.method}
                helperText={touched.method && errors.method}>
                {["GET", "POST", "PUT", "DELETE"].map((method) => (
                  <MenuItem key={method} value={method}>
                    {method}
                  </MenuItem>
                ))}
              </Field>
            </Box>

            {/* Status Code and Timeout */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                gap: 2,
                mt: 2,
              }}>
              <Field
                name="statusCode"
                as={TextField}
                label="Expected Status Code"
                type="number"
                fullWidth
                error={touched.statusCode && !!errors.statusCode}
                helperText={touched.statusCode && errors.statusCode}
              />
              <Field
                name="timeout"
                as={TextField}
                label="Timeout (ms)"
                type="number"
                fullWidth
                error={touched.timeout && !!errors.timeout}
                helperText={touched.timeout && errors.timeout}
              />
            </Box>

            {/* Headers Field */}
            <Box sx={{ mt: 2 }}>
              <Field
                name="headers"
                as={TextField}
                label="Headers (JSON)"
                multiline
                rows={3}
                fullWidth
                error={touched.headers && !!errors.headers}
                helperText={touched.headers && errors.headers}
              />
            </Box>

            {/* Payload Field (Shown for POST/PUT) */}
            {(values.method === "POST" || values.method === "PUT") && (
              <Box sx={{ mt: 2 }}>
                <Field
                  name="payload"
                  as={TextField}
                  label="Payload (JSON)"
                  multiline
                  rows={3}
                  fullWidth
                  error={touched.payload && !!errors.payload}
                  helperText={touched.payload && errors.payload}
                />
              </Box>
            )}

            {/* Response Object */}
            <Box sx={{ mt: 2 }}>
              <Field
                name="response"
                as={TextField}
                label="Response (JSON)"
                multiline
                rows={3}
                fullWidth
                error={touched.response && !!errors.response}
                helperText={touched.response && errors.response}
              />
            </Box>
          </Box>

          {/* Footer */}
          <Box
            sx={{
              display: "flex",
              position: "absolute",
              bottom: "0",
              width: "100%",
              justifyContent: "space-between",
              p: 2,
              borderTop: "1px solid #e0e0e0",
            }}>
            <Button type="reset" variant="contained" color="secondary">
              Reset
            </Button>
            <Button type="submit" variant="contained" color="secondary">
              Submit
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default PytestEdit;
