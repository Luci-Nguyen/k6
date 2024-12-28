import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";
import { expect } from 'https://jslib.k6.io/k6chaijs/4.3.4.3/index.js';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { userAPI } from './api/ApiUser.js';
import { BASE_URL, setHeader } from './endpoint/Endpoint.js';
import Ajv from './libs/ajv.bundle.js';
import { describe, test } from './utils/Common.js';
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
        { duration: '10s', target: 50 }, // Ramp-up to 50 VUs over 5 minutes
        { duration: '20s', target: 50 }, // Stay at 50 VUs for 10 minutes
        { duration: '10s', target: 0 },  // Ramp-down to 0 VUs over 5 minutes
    ],
};
export default function () {

    let resp;
    const headers = { setHeader }
    const apiUser = userAPI(BASE_URL.baseURL, headers)

    describe("API user", function () {

        test("Get all user", function () {
            resp = apiUser.getAllUser(2);
            expect(resp.status, "status").to.equal(200)
            expect(ajv.validate(schemaListUser, resp.json()), "validate schema all user").to.be.true
        })

        test("Get one user", function () {
            resp = apiUser.getSingleUser(9);
            expect(resp.status, "status").to.equal(200);
            expect(ajv.validate(schemaSingleUser, resp.json()), "validate schema single user").to.be.true
        })


    })


}