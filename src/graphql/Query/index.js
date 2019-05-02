const Query = `
type Query {
  Addresses(where: AddressInput, limit: Int): [Address]
  PostalCodes(where: PostalCodeInput, limit: Int): [PostalCode]
  PostalCodeChanges(where: PostalCodeChangeInput, limit: Int): [PostalCodeChange]
}
`;

export default Query;
