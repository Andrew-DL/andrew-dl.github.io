/**
 *@jest-environment jsdom
 */

// query utilities:
import {
    fireEvent,
    getByLabelText,
    getByText,
    getByTestId,
    queryByLabelText,
    queryByTestId,
    // Tip: all queries are also exposed on an object
    // called "queries" which you could import here as well
    waitFor,
    queries,
} from '@testing-library/dom'
// adds special assertions like toHaveTextContent
import '@testing-library/jest-dom'
import { readFileSync } from 'node:fs'

function getExampleDOM() {
    // This is just a raw example of setting up some DOM
    // that we can interact with. Swap this with your UI
    // framework of choice 😉
    const div = document.createElement('div')
      div.innerHTML = `
    <label for="username">Username</label>
    <input id="username" />
    <button>Print Username</button>
  `
    const button = div.querySelector('button')
    const input = div.querySelector('input')
    button.addEventListener('click', () => {
	// let's pretend this is making a server request, so it's async
	// (you'd want to mock this imaginary request in your unit tests)...
	setTimeout(() => {
	    const printedUsernameContainer = document.createElement('div')
	          printedUsernameContainer.innerHTML = `
        <div data-testid="printed-username">${input.value}</div>
      `
	    div.appendChild(printedUsernameContainer)
	}, Math.floor(Math.random() * 200))
    })
    return div
}

test('examples of some things', async () => {
    const famousProgrammerInHistory = 'Ada Lovelace'
    const container = getExampleDOM()

    // Get form elements by their label text.
    // An error will be thrown if one cannot be found (accessibility FTW!)
    const input = getByLabelText(container, 'Username')
    input.value = famousProgrammerInHistory

    // Get elements by their text, just like a real user does.
    getByText(container, 'Print Username').click()

    await waitFor(() =>
	expect(queryByTestId(container, 'printed-username')).toBeTruthy(),
    )

    // getByTestId and queryByTestId are an escape hatch to get elements
    // by a test id (could also attempt to get this element by its text)
    expect(getByTestId(container, 'printed-username')).toHaveTextContent(
	famousProgrammerInHistory,
    )
    // jest snapshots work great with regular DOM nodes!
    expect(container).toMatchSnapshot()
})

/*
_______________________________________________
THE ABOVE TEST AND FUNCTION ARE EXAMPLES FROM THE TESTING LIBRARY DOCUMENTATION
_______________________________________________
*/

/*test("Checks to see if user's inputs are being correctly added to the task list", async () => {
    
})*/


test.only('Checks to see if tasks are getting added to the list in localstorage', async () => {
    /*console.log(localStorage)
    let data = JSON.parse(localStorage.taskList)*/
    
    document.body.innerHTML = readFileSync("index.html")
    let taskInput = getByLabelText(document.body, 'What Do You Need To Do?')
    let taskList = []
    let tlString = JSON.stringify(taskList)
    localStorage.setItem('taskList', tlString)
    let tlArray = JSON.parse(localStorage.getItem('taskList'))

    taskInput.focus()
    fireEvent.keyDown(taskInput, {key: "A", code: 'KeyA'})
    fireEvent.keyDown(taskInput, {key: "B", code: 'KeyB'})
    fireEvent.keyDown(taskInput, {key: "Enter", code: 'Enter'})
    
    //let tlArray = JSON.parse(localStorage.getItem('taskList'))

    await waitFor(() => {
	expect((function() {
	    tlArray = JSON.parse(localStorage.getItem('taskList'))
	    //console.log(tlArray)
	    if(tlArray.length >= 1) {
		//console.log(localStorage.getItem('taskList'), tlArray, 'tlArray.length >=1')
		return tlArray
	    } else if (tlArray.length === 0) {
		//console.log(localStorage.getItem('taskList'), tlArray, 'tlArray.length < 1')
		throw new Error("tlArray is empty")
	    }
	    else {
		throw new Error("tlArray is null")
	    }
	})()).toHaveProperty(tlArray[0].task, 'AB')
    }, {timeout: 4900, onTimeout: () => console.log(localStorage.getItem('taskList'), 'onTimeout')})
    
    //expect(tlArray[tlArray.length - 1].task).toBe('AB')
})

test.skip('test waitfor', async () => {
    await waitFor(() => {
	expect((function() {
	    let n = Math.random()
	    if(n > 0.95) {
		console.log(n)
		return 'orNotToBe'
	    } else {
		console.log(n)
		throw new Error("this shit doesn't work!!!")
	    }
	})()).toBe('orNotToBe')
    })
})
//do this but in another way
