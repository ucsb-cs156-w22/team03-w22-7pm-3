import React, {useState} from 'react'
import { Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'


function UCSBSubjectsForm({ initialUCSBSubject, submitAction, buttonLabel="Create" }) {

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
                        data-testid="UCSBSubjectsForm-id"
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
                    data-testid="UCSBSubjectsForm-subjectCode"
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
                    data-testid="UCSBSubjectsForm-subjectTranslation"
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
                    data-testid="UCSBSubjectsForm-deptCode"
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
                <Form.Label htmlFor="CollegeCode">College Code</Form.Label>
                <Form.Control
                    data-testid="UCSBSubjectsForm-CollegeCode"
                    id="CollegeCode"
                    type="text"
                    isInvalid={Boolean(errors.CollegeCode)}
                    {...register("CollegeCode", { required: "College Code is required." })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.CollegeCode && 'College Code is required. '}
                </Form.Control.Feedback>
            </Form.Group>


            <Form.Group className="mb-3" >
                <Form.Label htmlFor="relatedDeptCode">Related Department Code</Form.Label>
                <Form.Control
                    data-testid="UCSBSubjectsForm-relatedDeptCode"
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
                    data-testid="UCSBSubjectsForm-inactive"
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
                data-testid="UCSBSubjectsForm-submit"
            >
                {buttonLabel}
            </Button>
            <Button
                variant="Secondary"
                onClick={() => navigate(-1)}
                data-testid="UCSBSubjectsForm-cancel"
            >
                Cancel
            </Button>

        </Form>

    )
}

export default UCSBSubjectsForm;
