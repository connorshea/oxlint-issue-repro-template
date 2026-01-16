declare const typeAwareViolation: string;

// This is a violation of the type-aware rule no-misused-spread. If it is not reported, type-aware rules aren't working.
const typeAwareViolationString = [...typeAwareViolation];

console.log(typeAwareViolation);
