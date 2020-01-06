export function simplifyDatetime(dt) {
    let d =  Date.parse(dt);
    let n = new Date(d);
    return n.toLocaleString();
}