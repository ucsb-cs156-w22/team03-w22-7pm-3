import React, {useState} from 'react'
import { Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

function EarthquakesForm({initialEarthquake, submitAction, buttonLabel="Retrieve" }) {
    // Stryker disable all
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm(
        { defaultValues: initialEarthquake || {}, }
    );
    // Stryker enable all

    const navigate = useNavigate();

    // const invalid_regex = /((true)|(false))/;

    return (

        <Form onSubmit={handleSubmit(submitAction)}>
            
            <Form.Group className="mb-3" >
                <Form.Label htmlFor="distance">Distance from UCSB's Storke Tower (in km)</Form.Label>
                <Form.Control
                    data-testid="EarthquakesForm-distance"
                    id="distance"
                    type="text"
                    isInvalid={Boolean(errors.distance)}
                    {...register("distance", { required: 'distance is required.'})}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.distance && 'Distance is required.'}
                </Form.Control.Feedback>
            </Form.Group>     
            <Form.Group className="mb-3" >
                <Form.Label htmlFor="minMag">Minimum magnitude</Form.Label>
                <Form.Control
                    data-testid="EarthquakesForm-minMag"
                    id="minMag"
                    type="text"
                    isInvalid={Boolean(errors.minMag)}
                    {...register("minMag", { required: 'minMag is required.'})}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.minMag && 'Minimum magnitude is required.'}
                </Form.Control.Feedback>
            </Form.Group>               
            
            <Button
                type="retrieve"
                data-testid="EarthquakesForm-retrieve"
            >
                {buttonLabel}
            </Button>
            <Button
                variant="Secondary"
                onClick={() => navigate(-1)}
                data-testid="EarthquakesForm-cancel"
            >
                Cancel
            </Button>

        </Form>

    )
}

export default EarthquakesForm;