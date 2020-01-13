

export function simplifyDatetime(dt) {

    if(!dt)
        return '';
        
    let d =  Date.parse(dt);
    let n = new Date(d);
    
    return `${n.getFullYear()}-${n.getMonth()}-${n.getDate()} ${n.getHours()}:${n.getMinutes()}`;
}