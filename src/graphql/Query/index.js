const Query = `
type Query {
  Addresses(where: AddressInput): [Address]
  PostalCodes(where: PostalCodeInput): [PostalCode]
  PostalCodeChanges(where: PostalCodeChangeInput): [PostalCodeChange]
}
`;

export default Query;
