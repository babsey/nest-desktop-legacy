import { TimedeltaPipe } from './timedelta.pipe';

describe('TimedeltaPipe', () => {
  it('create an instance', () => {
    const pipe = new TimedeltaPipe();
    expect(pipe).toBeTruthy();
  });
});
