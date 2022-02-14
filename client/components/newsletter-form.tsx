import { FC, FormEvent } from "react";
import * as yup from "yup";
import Button from "./atoms/button";
import Field from "./field";

const NewsletterForm: FC = () => {
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const { email } = Object.fromEntries(formData.entries());

    const valid = await yup.string().email().required().isValid(email);
    if (!valid) return;

    console.log("news");
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-end">
      <Field
        name="email"
        label="Your e-mail"
        inputProps={{ placeholder: "example@mail.com", type: "email" }}
      />
      <Button size="lg" variant="primary">
        Subscribe
      </Button>
    </form>
  );
};

export default NewsletterForm;
