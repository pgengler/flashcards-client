type Err = { message: string };

export default function validationErrors(errors?: Err[]) {
  if (!errors) return null;
  return errors.map((e) => e.message).join(', ');
}
