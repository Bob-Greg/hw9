import React, {useState} from 'react';
import './App.css';

async function sleep(ms: number) {
    new Promise(r => setTimeout(r, ms))
}

function radixSort<T>(arr: T[], key: (a: T) => number) {
    let counts = new Array<number>(256)
    counts.fill(0)

    let nums = new Array<number>()
    let output = new Array<number>()

    // HEY GUYS I USED A DICTIONARY!
    let things = new Map<number, T>()

    for (const i of arr) {
        const key1 = key(i)
        things.set(key1, i)
        nums.push(key1)
        output.push(0)
    }

    let oio = true

    function psum(arr: number[]) {
        for (let i = 1; i < arr.length; i++) {
            arr[i] += arr[i - 1]
        }
    }

    for (let shift = 0, i = 0; shift < 4; shift++, i += 8) {
        for (const j of nums) {
            counts[(j >> i) & 0xff]++
        }
        psum(counts)

        for (let j = arr.length - 1; j >= 0; j--) {
            let index = --counts[(nums[j] >> i) & 0xff];
            output[index] = nums[j]
            arr[index] = things.get(output[index]) as T
        }

        { // swap ptrs of output and nums
            let tmp = output
            output = nums
            nums = tmp
        }

        counts.fill(0)
        oio = !oio
    }

    return arr
}

function App() {

    type T = {
        value: string
        key: number
    }

    const amt = 10000

    const [generated, setGenerated] = useState(false)
    const [start, setStart] = useState(0)
    const [end, setEnd] = useState(0)
    const [things, setThings] = useState([] as T[])
    const [oldThings, setOldThings] = useState([] as T[])
    const [sorted, setSorted] = useState(false)

    async function a() {
        let _things = new Array<T>(amt)
        let _oldThings = new Array<T>(amt)
        let rand = Math.floor(Math.random() * 10000000)
        for (let i = 0; i < amt; i++) {
            // use xorshift to generate a random number
            rand ^= rand << 13;
            rand ^= rand >> 7;
            rand ^= rand << 17;
            const randNum = Math.abs(rand % 100000)
            _things[i] = _oldThings[i] = {value: (rand + 1).toString(36).replace(/[^a-z]+/g, ''), key: randNum}
        }
        setThings([])
        setOldThings([])
        await sleep(1)
        setThings(_things)
        setOldThings(_oldThings)
        setGenerated(true)
        setSorted(false)
    }

    return (
        <div className={
            "m5x7 text-6xl white overflow-auto w-screen h-screen saturate bg-slate-200 pt-6 pr-6 pb-6 pl-6"
        }>
            <span className={"text-4xl white-1"}>Radix sort of objects</span><br/>
            <div className={""}/>
            <button className={"text-3xl white-1"} onClick={a}>
                Generate objects
            </button>
            { generated &&
                <>
                    <div className={"-mt-7"}/>
                    <button className={"text-3xl white-1"} onClick={() => {
                        setStart((new Date()).getTime())
                        radixSort<T>(things, a => a.key)
                        setEnd((new Date()).getTime())
                        setSorted(true)
                    }}>
                        Sort objects
                    </button>
                </>
            }
            <div className={"-mt-1"}/>
            { start !== 0 &&
                <span className={"text-3xl white-1"}>Sorted {amt} objects in {end - start} milliseconds</span>
            }
            <div className={"mt-4"}/>
            {generated &&
                <div className={`grid ${sorted ? 'grid-cols-2' : 'grid-cols-1'}`}>
                    <div className={"text-4xl white-1"}>Original:</div>
                    {sorted &&
                        <div className={"text-4xl white-1"}>Sorted:</div>
                    }
                    <div className={"text-xl white-1"}>
                        {oldThings.map(s => <div>T(value={s.value}, key={s.key})</div>)}
                    </div>
                    {sorted &&
                        <div className={"text-xl white-1"}>
                            {things.map(s => <div>T(value={s.value}, key={s.key})</div>)}
                        </div>
                    }
                </div>
            }
        </div>
    );
}

export default App;
