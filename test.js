import { Selector, RequestMock } from 'testcafe';

const mock = RequestMock()
    .onRequestTo(/request/)
    .respond(async (req, res) => {
        await new Promise((r) => setTimeout(r, 10000));

        res.setBody('some fake content');
    });

fixture `Delayed response and not`
    .page('http://localhost:3000');

test.requestHooks(mock)
('Delayed response', async t => {
    await t.click('#send-request');

    await t.expect(Selector('#response').textContent).eql('some fake content', { timeout: 15000 });

    const elapsedTime = await Selector('#elapsed-time').textContent;

    await t.expect(parseInt(elapsedTime, 10)).gte(10000);
});

test('Not delayed response', async t => {
    await t.click('#send-request');

    await t.expect(Selector('#response').textContent).eql('some actual content');

    const elapsedTime = await Selector('#elapsed-time').textContent;

    await t.expect(parseInt(elapsedTime, 10)).lt(10000);
});
