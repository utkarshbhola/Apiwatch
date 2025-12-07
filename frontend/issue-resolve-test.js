import http from "k6/http";
import { check } from "k6";

export let options = {
    vus: 20,
    iterations: 20,
};

export default function () {
    let res = http.put("http://localhost:8080/issue/123/resolve");

    console.log("STATUS:", res.status, "BODY:", res.body);

    check(res, {
        "status is 200 or 409": r => r.status === 200 || r.status === 409
    });
}
