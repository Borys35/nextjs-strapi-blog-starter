import { NextPage } from "next";
import { FormEvent } from "react";
import Button from "../components/atoms/button";
import Container from "../components/atoms/container";
import Heading from "../components/atoms/heading";
import Paragraph from "../components/atoms/paragraph";
import Field from "../components/field";
import Layout from "../components/layout";

const Contact: NextPage = () => {
  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const form = new FormData(e.target as HTMLFormElement);
    const formData = Object.fromEntries(form.entries());

    console.log("data from form", formData);
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
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 xl:px-24"
          >
            <Field label="Subject" />
            <Field
              label="Your e-mail"
              inputProps={{ placeholder: "example@mail.com", type: "email" }}
            />
            <Field label="Message" inputProps={{ type: "textarea" }} />
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
