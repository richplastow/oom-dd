describe('${{classname}} (node)', () => {




const Class = ${{classname}}, stat = Class.stat


describe(`+ve ${{classname}} class`, () => {
    it(`should be a class`, () => {
        eq('function', typeof Class, '${{classname}} should be a function')
    })
})




})//describe('${{classname}} (node)')
