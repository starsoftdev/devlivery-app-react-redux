import localStorage from 'localStorage';

export const loadState = () => {
    try {
        const serializedState = localStorage.getItem('state');
        if(serializedState == null){
            return undefined;
        }
        console.log("loadstate is done!");
        return JSON.parse(serializedState);
    } catch (err){
        console.log("loadstate error",err);
        return undefined;
    }
}
export const saveState = (state) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem('state', serializedState);
        console.log("savestate is done!");
    } catch (err) {
        //ignore write errors
        console.log("saveSate error");
    }
}