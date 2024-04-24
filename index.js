import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

let grid = { "size": 3, "goals": ["Sharpness V", "Snowy taiga", "Wither", "End", "Table", "Repopulation", "Bedbomb Nino", "Jungle", "Cow"], "categories": ["ENCHANTEMENT", "BIOME", "KILL", "DIMENSION", "CRAFT", "ACHIEVEMENT", "AUTRE", "BIOME", "KILL"] }

const adminData = { "type": "open", "data": { "user": { "isAdmin": true, "team": null }, "grid": grid, "teams": [{ "index": 0, "grid": ["completed", "completed", "completed", "completed", "completed", "pending", "pending", "pending", "pending"] }, { "index": 1, "grid": ["completed", "completed", "completed", "completed", "completed", "completed", "missing", "missing", "missing"] }, { "index": 2, "grid": ["completed", "completed", "completed", "completed", "completed", "completed", "completed", "completed", "completed"] }, { "index": 3, "grid": ["missing", "completed", "completed", "rejected", "missing", "completed", "completed", "completed", "missing"] }], "gameStarted": false, "goals": { "CRAFT": ["Jukebox", "Table"], "ACHIEVEMENT": ["Repopulation", "Getting wood"], "ENCHANTEMENT": ["Protection I", "Sharpness V"], "BIOME": ["Snowy taiga", "Jungle"], "DIMENSION": ["Nether", "End"], "KILL": ["Cow", "Wither"] } } };
const adminAndPlayerData = { "type": "open", "data": { "user": { "isAdmin": true, "team": 1 }, "grid": grid, "teams": [{ "index": 0, "grid": ["completed", "completed", "completed", "completed", "completed", "pending", "pending", "pending", "pending"] }, { "index": 1, "grid": ["completed", "completed", "completed", "completed", "completed", "completed", "missing", "missing", "missing"] }, { "index": 2, "grid": ["completed", "completed", "completed", "completed", "completed", "completed", "completed", "completed", "completed"] }, { "index": 3, "grid": ["missing", "completed", "completed", "rejected", "missing", "completed", "completed", "completed", "missing"] }], "gameStarted": true, "goals": { "CRAFT": ["Jukebox", "Table"], "ACHIEVEMENT": ["Repopulation", "Getting wood"], "ENCHANTEMENT": ["Protection I", "Sharpness V"], "BIOME": ["Snowy taiga", "Jungle"], "DIMENSION": ["Nether", "End"], "KILL": ["Cow", "Wither"] } } };
const notAdminData = { "type": "open", "data": { "user": { "isAdmin": false, "team": 1 }, "grid": grid, "teams": [{ "index": 1, "grid": ["missing", "missing", "missing", "missing", "missing", "missing", "missing", "missing", "missing"] }], "gameStarted": true } };

let response = true

let counter = 1;

wss.on('connection', function connection(ws) {
    ws.on('message', function message(msg) {
        const parsedMsg = JSON.parse(msg)
        console.log(parsedMsg)
        switch (parsedMsg.type) {
            case "uuid":
                // setTimeout(() => {
                if (parsedMsg.data.uuid == "admin") {
                    ws.send(JSON.stringify(adminData))
                } else if (parsedMsg.data.uuid == "admin2") {
                    ws.send(JSON.stringify(adminAndPlayerData))
                } else if (parsedMsg.data.uuid == "adminaaa") {
                    ws.send(JSON.stringify(notAdminData))
                } else if (parsedMsg.data.uuid == "error") {
                    if (counter < 3) {
                        counter += 1
                        ws.close()
                    } else {
                        ws.send(JSON.stringify(notAdminData))
                        setTimeout(ws.close, 1000)
                    }
                } else {
                    ws.send(JSON.stringify({
                        "type": "open",
                        error: 401
                    }))
                }
                // }, 10000)
                break;
            case "goalRequest":
                const cellData = {
                    type: "cell",
                    data: {
                        teamIndex: parsedMsg.data.team,
                        cellIndex: parsedMsg.data.goalIndex,
                        cell: response ? "completed" : "rejected"
                    }
                }
                response = !response
                ws.send(JSON.stringify(cellData))
                break;
            case "grid":
                grid = parsedMsg.data.grid
                ws.send(JSON.stringify({
                    type: "grid",
                    data: {
                        grid: grid
                    }
                }))
                break;
            case "error":
                ws.close()
        }
    });
    // setTimeout(() => {
    //     ws.send(JSON.stringify({
    //         type: "grid", data: { grid: { "size": 3, "goals": ["Manger A", "Manger B", "Manger C", "Manger D", "Manger E", "Manger F", "Manger G", "Manger H", "Manger I"] } }
    //     }))
    // }, 5000)
    // setTimeout(() => {
    //     ws.send(JSON.stringify({
    //         type: "grid", data: { grid: { "size": 5, "goals": ["Manger A", "Manger B", "Manger C", "Manger D", "Manger E", "Manger F", "Manger G", "Manger H", "Manger I", "Manger J", "Manger K", "Manger L", "Manger M", "Manger N", "Manger O", "Manger P", "Manger Q", "Manger R", "Manger S", "Manger T", "Manger U", "Manger V", "Manger W", "Manger X", "Manger Y"] } }
    //     }))
    // }, 10000)
});