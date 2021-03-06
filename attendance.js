let aliases = {};

let attendees = [];

let senderRes1 = function () {
}

chrome.storage.onChanged.addListener(function (data) {
    aliases = {};
    attendees = [];
    data.aliases.newValue.forEach(al =>
        aliases[al.originalName] = al.aliasName
    )
    console.log(aliases);
})

chrome.runtime.onMessage.addListener(
    function (message, sender, sendResponse) {
        senderRes1 = sendResponse;
        const {msg, tabId} = message;
        console.log(sender);
        if (msg === 'downloadReq') {
            saveTextFile();
        } else if (msg === 'scan') {
            console.log('Req to scan')
            const containers = document.getElementsByClassName('XWGOtd');
            if (!containers || !containers.length) {
                document.getElementsByClassName('uArJ5e UQuaGc kCyAyd kW31ib foXzLb')[0].click()
                setTimeout(function () {
                    const ele = document.getElementsByClassName('s2gQvd')[0]
                    scrollTo(ele, ele.scrollHeight, 5000).then(
                        function () {
                            senderRes1({count: attendees.length})
                            console.log('Scan Complete');
                            document.getElementsByClassName('ThdJC kaAt2 c0XF8e s7PhZd Z9zn3b sUgV6e')[0].click()
                            chrome.runtime.sendMessage(
                                "dmoopggkbcfpjeecmjcpbfegladgijaj",
                                {tabId: tabId},
                                function (res) {
                                    console.log('Done!!!', res);

                                }
                            );
                            /* chrome.pageAction.show(tabId, function () {
                                 console.log('Shown')
                             })*/
                        }
                    )
                }, 1000)
            } else {
                const ele = document.getElementsByClassName('s2gQvd')[0]
                scrollTo(ele, ele.scrollHeight, 5000).then(
                    function () {
                        senderRes1({count: attendees.length})
                        console.log('Scan Complete');
                        /*chrome.pageAction.show(tabId, function () {
                            console.log('Shown')
                        })*/
                    }
                )
            }
        } else if (msg === 'needCount') {
            console.log('needCount');
            senderRes1({count: attendees.length})
        } else if (msg === 'clearAttendance') {
            attendees = [];
            senderRes1('done')
        } else {
        }
        console.log("Message : ", message);
    });

function scrollTo(element, to,) {
    return new Promise(function (res, rej) {
        const duration = ((+document.getElementsByClassName('wnPUne N0PJ8e')[0].innerHTML || 0) / 10) * 400
        element.scrollTop = 0;
        return setTimeout(async function () {
            let start = element.scrollTop,
                change = to - start,
                currentTime = 0,
                increment = 20;

            const animateScroll = function () {
                currentTime += increment;

                function easeInOutQuad(t, b, c, d) {
                    t /= d / 2;
                    if (t < 1) return c / 2 * t * t + b;
                    t--;
                    return -c / 2 * (t * (t - 2) - 1) + b;
                }

                element.scrollTop = easeInOutQuad(currentTime, start, change, duration);
                if (currentTime < duration) {
                    setTimeout(animateScroll, increment);
                }
            };
            await animateScroll();
            await res()
        }, 1000)
    })
}

(function () {

    MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    const observer = new MutationObserver(function (mutations, observer) {
        const containers = document.getElementsByClassName('XWGOtd');
        for (const container of containers) {
            const attendeeContainers = container.children;
            if (attendeeContainers) {
                let attendee = attendeeContainers[0].dataset.sortKey.split('spaces')[0].trim();
                if (aliases[attendee]) attendee = aliases[attendee];
                if (!attendees.includes(attendee)) {
                    attendees.push(attendee);
                }
            }
        }
    });


    observer.observe(document, {
        subtree: true,
        attributes: true
    });

})();


function saveTextFile() {
    //console.log('saveTextFile: call')
    function twoDigits(v) {
        return ('0' + Number(v)).slice(-2)
    }

    let today = new Date(), d = today.getDate(), m = today.getMonth() + 1, y = today.getFullYear()
    let cdate = y + '-' + twoDigits(m) + '-' + twoDigits(d),
        ctime = today.getHours() + ':' + twoDigits(today.getMinutes())
    let header =
        `Attendance bot: dev(Pavan:p2pdops@gmail.com) on ${cdate} : ${ctime} : \n\n ${(attendees.length) ? 'Members :' + attendees.length : 'No Members'}\n\n`;
    let txt = attendees.join('\n');
    let blob = new Blob([header + txt], {type: 'text/plain;charset=utf-8'})
    let temp_a = document.createElement("a")
    temp_a.download = `Meet attendance -(${cdate} : ${ctime})-(doperbot).csv`
    temp_a.href = window.webkitURL.createObjectURL(blob)
    temp_a.click()
}
