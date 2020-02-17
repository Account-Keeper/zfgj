

export function simplifyDatetime(date) {
    if(!date)
        return date;

    let t = date.split(/[- :]/);
    // Apply each element to the Date function
    let d = new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear(),
        hour = '' + d.getHours(),
        min = '' + d.getMinutes();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;
    if (hour.length < 2) {
        hour = `0${hour}`;
    }

    if (min.length < 2) {
        min = `0${min}`;
    }
    return [year, month, day].join('-') + ' ' +hour + ':' + min;
}

export function formatDatetimeLocal(date) {
    if(!date)
        return '';

    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear(),
        hour = '' + d.getHours(),
        min = '' + d.getMinutes();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;
    if (hour.length < 2) {
        hour = `0${hour}`;
    }

    if (min.length < 2) {
        min = `0${min}`;
    }


    return [year, month, day].join('-') + ' ' +hour + ':' + min;
}

function createDateAsUTC(date) {
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()));
}

export function formatDate(date) {
    if(!date)
        return '';

    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();
        

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}

export function formatDateTime(date) {
    if(!date)
        return date;
        
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear(),
        hour = '' + d.getHours(),
        min = '' + d.getMinutes();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-')+ ' ' +hour + ':' + min;
}

export function formatDate_Date(date) {
    var d = date,
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}


export function format_seconds(seconds) {
    /*
    Examples:
        >>> format_seconds(1)
        '1 Second'
        >>> format_seconds(30)
        '30 Seconds'
        >>> format_seconds(60)
        '1 Minute'
        >>> format_seconds(60 * 15)
        '15 Minutes'
        >>> format_seconds(60 * 60)
        '1 Hour'
        >>> format_seconds(60 * 60 * 2)
        '2 Hours'
        >>> format_seconds(60 * 60 * 24)
        '1 Day'
        >>> format_seconds(60 * 60 * 48)
        '2 Days'
   
   let _seconds = 0;

    if(seconds < 0)
        _seconds = 0

    d = datetime(1, 1, 1) + timedelta(seconds=seconds)
    days = timedelta(seconds=seconds).days
    if days:
        unit = "Day"
        value = days
    elif d.hour:
        unit = "Hour"
        value = d.hour
    elif d.minute:
        unit = "Minute"
        value = d.minute
    else:
        unit = "Second"
        value = seconds
    if value > 1:
        unit = unit + "s"
    return '{} {}'.format(value, unit)
 */
}