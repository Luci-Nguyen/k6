import { check } from 'k6';


export function verifyStatusCode(response, code) {
    check(response, {
        [`status code is ${code}`]: r => r.status === code
    })
}

export function checkSchema(response, schema) {
    const parsedResponse = JSON.parse(response.body);

    for (const [key, value] of Object.entries(schema.properties)) {
        if (schema.required.includes(key)) {
            if (parsedResponse[key] === undefined) {
                return false;
            }
            if (typeof parsedResponse[key] !== value.type) {
                return false;
            }
        }
    }
    return true;
}
export const setHeaders = {
    'Content-Type': 'application/json',
};
export function validateSchema(response, schema) {
    check(response, {
        'valid schema': (r) => checkSchema(r, schema),
    });
}
