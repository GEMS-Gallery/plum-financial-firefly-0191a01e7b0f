export const idlFactory = ({ IDL }) => {
  const Result_1 = IDL.Variant({ 'ok' : IDL.Nat, 'err' : IDL.Text });
  const Item = IDL.Record({
    'id' : IDL.Nat,
    'icon' : IDL.Opt(IDL.Text),
    'name' : IDL.Text,
  });
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  return IDL.Service({
    'addItem' : IDL.Func([IDL.Text, IDL.Opt(IDL.Text)], [Result_1], []),
    'getItems' : IDL.Func([], [IDL.Vec(Item)], ['query']),
    'removeItem' : IDL.Func([IDL.Nat], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };
