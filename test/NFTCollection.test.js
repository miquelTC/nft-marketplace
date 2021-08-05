const { expectRevert } = require('@openzeppelin/test-helpers');

const NFTCollection = artifacts.require('./NFTCollection.sol');

contract('NFTCollection', (accounts) => {
  let contract;

  before(async () => {
    contract = await NFTCollection.new();
  });

  describe('deployment', () => {
    it('deploys successfully', async () => {
      const address = contract.address;
      assert.notEqual(address, 0x0);
      assert.notEqual(address, '');
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
    });

    it('has a name', async() => {
      const name = await contract.name();
      assert.equal(name, 'mTC Collection');
    });

    it('has a symbol', async() => {
      const symbol = await contract.symbol();
      assert.equal(symbol, 'mTC');
    });
  });

  describe('minting', () => {
    it('creates a new token', async () => {
      const result = await contract.safeMint('testURI');
      const totalSupply = await contract.totalSupply();

      // SUCCESS
      assert.equal(totalSupply, 1);
      const event = result.logs[0].args;
      assert.equal(event.tokenId.toNumber(), 1, 'id is correct');
      assert.equal(event.from, '0x0000000000000000000000000000000000000000', 'from is correct');
      assert.equal(event.to, accounts[0], 'to is correct')

      // FAILURE: cannot mint same color twice
      await expectRevert(contract.safeMint('testURI'), 'The token URI should be unique');
    });

    it('token URI is correctly assigned', async() => {
      // SUCCESS
      const tokenURI = await contract.tokenURI(1);
      assert.equal(tokenURI, 'testURI');

      // FAILURE
      await expectRevert(contract.tokenURI(2), 'ERC721Metadata: URI query for nonexistent token');
    });
  });
});