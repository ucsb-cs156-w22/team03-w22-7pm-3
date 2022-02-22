import React, {useState} from 'react'
import { Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'


function UCSBSubjectForm({ initialUCSBSubject, submitAction, buttonLabel="Create" }) {

    // Stryker disable all
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm(
        { defaultValues: initialUCSBSubject || {}, }
    );
    // Stryker enable all

    const navigate = useNavigate();

    const invalid_regex = /((true)|(false))/;

    return (

        <Form onSubmit={handleSubmit(submitAction)}>

            {initialUCSBSubject && (
                <Form.Group className="mb-3" >
                    <Form.Label htmlFor="id">Id</Form.Label>
                    <Form.Control
                        data-testid="UCSBSubjectForm-id"
                        id="id"
                        type="text"
                        {...register("id")}
                        value={initialUCSBSubject.id}
                        disabled
                    />
                </Form.Group>
            )}

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="subjectCode">Subject Code</Form.Label>
                <Form.Control
                    data-testid="UCSBSubjectForm-subjectCode"
                    id="subjectCode"
                    type="text"
                    isInvalid={Boolean(errors.subjectCode)}
                    {...register("subjectCode", { required: "Subject Code is Required"})}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.subjectCode && 'Subject Code is required.'}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="subjectTranslation">Subject Translation</Form.Label>
                <Form.Control
                    data-testid="UCSBSubjectForm-subjectTranslation"
                    id="subjectTranslation"
                    type="text"
                    isInvalid={Boolean(errors.subjectTranslation)}
                    {...register("subjectTranslation", {
                        required: "Subject Translation is required."
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.subjectTranslation?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="deptCode">Department Code</Form.Label>
                <Form.Control
                    data-testid="UCSBSubjectForm-deptCode"
                    id="deptCode"
                    type="text"
                    isInvalid={Boolean(errors.deptCode)}
                    {...register("deptCode", { required: "Department Code is required." })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.deptCode && 'Department Code is required. '}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="collegeCode">College Code</Form.Label>
                <Form.Control
                    data-testid="UCSBSubjectForm-collegeCode"
                    id="collegeCode"
                    type="text"
                    isInvalid={Boolean(errors.collegeCode)}
                    {...register("collegeCode", { required: "collegeCode is required." })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.collegeCode && 'College Code is required. '}
                </Form.Control.Feedback>
            </Form.Group>


            <Form.Group className="mb-3" >
                <Form.Label htmlFor="relatedDeptCode">Related Department Code</Form.Label>
                <Form.Control
                    data-testid="UCSBSubjectForm-relatedDeptCode"
                    id="relatedDeptCode"
                    type="text"
                    isInvalid={Boolean(errors.relatedDeptCode)}
                    {...register("relatedDeptCode", { required: false })}
                />
                {/* <Form.Control.Feedback type="invalid">
                    {errors.relatedDeptCode && 'Related Dept Code is Required.'}
                </Form.Control.Feedback> */}
            </Form.Group>


            <Form.Group className="mb-3" >
                <Form.Label htmlFor="inactive">Inactive</Form.Label>
                <Form.Control
                    data-testid="UCSBSubjectForm-inactive"
                    id="inactive"
                    type="text"
                    isInvalid={Boolean(errors.inactive)}
                    {...register("inactive", { required: true, pattern: invalid_regex})}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.inactive && 'Inactive is required. '}
                    {errors.inactive?.type === 'pattern' && 'Inactive must be a Boolean, e.g \'true\' or \'false\''}
                </Form.Control.Feedback>
            </Form.Group>                        



            <Button
                type="submit"
                data-testid="UCSBSubjectForm-submit"
            >
                {buttonLabel}
            </Button>
            <Button
                variant="Secondary"
                onClick={() => navigate(-1)}
                data-testid="UCSBSubjectForm-cancel"
            >
                Cancel
            </Button>

        </Form>

    )
}

export default UCSBSubjectForm;
