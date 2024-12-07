import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { group } from 'k6';
import http from 'k6/http';
import { setHeaders, validateSchema, verifyStatusCode } from '../endpoint/common.js';
import { BASE_URL } from '../endpoint/endpoint.js';

export function handleSummary(data) {
    return {
        "report.html": htmlReport(data),
        stdout: textSummary(data, { indent: " ", enableColors: true }),
    };
}
export const options = {
    vus: 1,
    duration: '1s',
};
export default function () {
    const params = {
        header: setHeaders
    }


    const schema = {
        properties: {
            userId: { type: 'number' },
            id: { type: 'number' },
            title: { type: 'string' },
        },
        required: ['userId', 'id', 'title'],
    };



    group("Get api post", function () {
        const response = http.get(`${BASE_URL}/albums/1`, params)
        console.log(response.body);

        verifyStatusCode(response, 200)
        validateSchema(response, schema)
    })

    group("get demo api", function () {

        const schema = {
            properties: {
                id: { type: 'number' },
                title: { type: 'string' },
                price: { type: 'number' },
                description: { type: 'string' },
                category: { type: 'string' },
                image: { type: 'string' },
                rating: {
                    type: 'object',
                    properties: {
                        rate: { type: 'number' },
                        count: { type: 'number' }
                    },
                    required: ['rate', 'count'],
                },
            },
            required: ['id', 'title', 'price', 'description', 'category', 'image', 'rating'],
        };
        const response = http.get(`https://fakestoreapi.com/products/1`)
        console.log(response.body);

        verifyStatusCode(response, 200)
        validateSchema(response, schema)

    })

}