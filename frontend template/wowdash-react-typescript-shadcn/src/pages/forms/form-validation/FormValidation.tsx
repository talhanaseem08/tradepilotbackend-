import LazyWrapper from "@/components/LazyWrapper";
import Breadcrumb from "@/layouts/Breadcrumb";
import ValidateForm from "./ValidateForm";

const FormValidation = () => {
    return (
        <>
            <Breadcrumb title="FormValidation" text="FormValidation" />

            <LazyWrapper>
                <ValidateForm />
            </LazyWrapper>

        </>
    );
};

export default FormValidation;