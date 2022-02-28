import React from 'react';

import EarthquakesForm from "main/components/Earthquakes/EarthquakesForm"

export default {
    title: 'components/Earthquakes/EarthquakeForm',
    component: EarthquakesForm
};


const Template = (args) => {
    return (
        <EarthquakesForm {...args} />
    )
};

export const Default = Template.bind({});

Default.args = {
    submitText: "Retrieve",
    submitAction: () => { console.log("Retrieve was clicked"); }
};

export const Show = Template.bind({});

Show.args = {
    submitText: "",
    submitAction: () => { }
};