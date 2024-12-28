import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";
import { expect } from 'https://jslib.k6.io/k6chaijs/4.3.4.3/index.js';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { userAPI } from './api/ApiUser.js';
import { BASE_URL, setHeader } from './endpoint/Endpoint.js';
import Ajv from './libs/ajv.bundle.js';
import { describe } from './utils/Common.js';
import { schemaListUser, schemaSingleUser } from './utils/User.schema.js';
const ajv = new Ajv();
export function handleSummary(data) {
    return {
        "result.html": htmlReport(data),
        stdout: textSummary(data, { indent: " ", enableColors: true }),
    };
}

export let options = {
    stages: [
        { duration: '5s', target: 10 },  // Ramp up to 10 VUs over 5s
        { duration: '10s', target: 100 }, // Ramp up to 100 VUs over 10s
        { duration: '10s', target: 500 }, // Ramp up to 500 VUs over 10s
        { duration: '5s', target: 600 }, // Ramp up to 1000 VUs over 5s
    ],
};

export default function () {

    let resp;
    const headers = { setHeader }
    const apiUser = userAPI(BASE_URL.baseURL, headers)

    describe("API user", function () {

        describe("Get all user", function () {
            resp = apiUser.getAllUser(2);
            expect(resp.status, "status").to.equal(200)
            expect(ajv.validate(schemaListUser, resp.json()), "validate schema all user").to.be.true
        })

        describe("Get one user", function () {
            resp = apiUser.getSingleUser(9);
            expect(resp.status, "status").to.equal(200);
            expect(ajv.validate(schemaSingleUser, resp.json()), "validate schema single user").to.be.true
        })
    })
}