const { expectRevert } = require('@openzeppelin/test-helpers');

const NFTCollection = artifacts.require('./NFTCollection.sol');

contract('NFTCollection', (accounts) => {
  let contract;

  before(async () => {
    contract = await NFTCollection.new();
  });

  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = contract.address;
      assert.notEqual(address, 0x0);
      assert.notEqual(address, '');
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
    });

    it('has a name', async () => {
      const name = await contract.name();
      assert.equal(name, 'mTC Collection');
    });

    it('has a symbol', async () => {
      const symbol = await contract.symbol();
      assert.equal(symbol, 'mTC');
    });
  });

  // describe('minting', async () => {
  //   it('creates a new token', async () => {
  //     const result = await contract.safeMint('#000000');
  //     const totalSupply = await contract.totalSupply();

  //     // SUCCESS
  //     assert.equal(totalSupply, 1);
  //     const event = result.logs[0].args;
  //     assert.equal(event.tokenId.toNumber(), 1, 'id is correct');
  //     assert.equal(event.from, '0x0000000000000000000000000000000000000000', 'from is correct');
  //     assert.equal(event.to, accounts[0], 'to is correct')

  //     // FAILURE: cannot mint same color twice
  //     await expectRevert(
  //       contract.safeMint('#000000'), 
  //       'The color should be unique'
  //     );
  //   });
  // });

  // describe('indexing', async () => {
  //   it('lists colors', async () => {
  //     // Mint 3 more tokens
  //     await contract.safeMint('#111111');
  //     await contract.safeMint('#222222');
  //     await contract.safeMint('#333333');
  //     const totalSupply = await contract.totalSupply();

  //     let color;
  //     let result = [];

  //     for (var i = 1; i <= totalSupply; i++) {
  //       color = await contract.colors(i - 1);
  //       result.push(color);
  //     }

  //     let expected = ['#000000', '#111111', '#222222', '#333333'];
  //     assert.equal(result.join(), expected.join());
  //   });
  // });
});