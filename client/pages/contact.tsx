import { yupResolver } from "@hookform/resolvers/yup";
import { NextPage } from "next";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import Button from "../components/atoms/button";
import Container from "../components/atoms/container";
import Heading from "../components/atoms/heading";
import Paragraph from "../components/atoms/paragraph";
import Field from "../components/field";
import Layout from "../components/layout";
import Socials from "../components/socials";
import { useGlobal } from "../providers/GlobalProvider";

const schema = yup.object({
  subject: yup.string().min(3).max(100).required(),
  email: yup.string().email().required(),
  message: yup.string().min(3).max(500).required(),
});

const Contact: NextPage = () => {
  const {
    attributes: { socials },
  } = useGlobal();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  // function handleSubmit(e: FormEvent) {
  //   e.preventDefault();

  //   const form = new FormData(e.target as HTMLFormElement);
  //   const formData = Object.fromEntries(form.entries());

  //   console.log("data from form", formData);
  // }

  function onSubmit(data: any) {
    console.log("data", data);
  }

  return (
    <Layout title="Contact" description="Get in touch with us!">
      <Container>
        <div className="my-12 col-start-1 col-end-13 md:col-start-2 md:col-end-12 lg:col-start-3 lg:col-end-11">
          <div className="text-center mb-16">
            <Heading level={1} className="mb-2">
              Contact
            </Heading>
            <Paragraph>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Alias
              architecto odit porro debitis ex obcaecati repellat!
            </Paragraph>
          </div>
          <div className="flex flex-wrap gap-6 justify-center mb-16 text-xl">
            <Socials socials={socials} />
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4 xl:px-24"
          >
            <Field
              // name="subject"
              label="Subject"
              inputProps={{ ...register("subject") }}
              error={errors.subject}
            />
            <Field
              // name="email"
              label="Your e-mail"
              inputProps={{
                placeholder: "example@mail.com",
                type: "email",
                ...register("email"),
              }}
              error={errors.email}
            />
            <Field
              // name="message"
              label="Message"
              inputProps={{ type: "textarea", ...register("message") }}
              error={errors.message}
            />
            <Button size="lg" variant="primary" className="mt-4 self-center">
              Send
            </Button>
          </form>
        </div>
      </Container>
    </Layout>
  );
};

export default Contact;
