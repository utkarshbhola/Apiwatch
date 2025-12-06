import http from "k6/http";
import { check, sleep } from "k6";

export let options = {
  vus: 20,         // 20 users
  iterations: 20,  // each user runs once
};

export default function () {
  const issueId = "6933d08b00b23535aa0b2b85";

  let res = http.put(`http://localhost:8080/issue/${issueId}/resolve`);

  check(res, {
    "status is 200 or 409": (r) => r.status === 200 || r.status === 409,
  });

  console.log(`Resolve attempt → Status: ${res.status}`);
}
