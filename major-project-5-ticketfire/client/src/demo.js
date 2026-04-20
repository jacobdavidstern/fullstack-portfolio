const param = new URLSearchParams(window.location.search).get('demo');

let demo = import.meta.env.MODE === 'production';

if (param === 'true') demo = true;
if (param === 'false') demo = false;

export const DEMO_MODE = demo;
