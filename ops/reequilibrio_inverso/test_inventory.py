import unittest

from inventory import parse_psi, parse_zram_mm_stat, parse_limit, safe_percent


class InventoryParserTests(unittest.TestCase):
    def test_parse_psi(self):
        got = parse_psi("some avg10=0.20 avg60=0.10 avg300=0.05 total=1234\nfull avg10=0.00 avg60=0.00 avg300=0.00 total=0")
        self.assertEqual(got["some"]["total"], 1234)
        self.assertAlmostEqual(got["some"]["avg10"], 0.20)
        self.assertEqual(got["full"]["total"], 0)

    def test_zram_compression_ratio(self):
        got = parse_zram_mm_stat("1000 250 300 0 0 0 0 0 0")
        self.assertEqual(got["original_bytes"], 1000)
        self.assertEqual(got["compression_ratio_original_over_compressed"], 4.0)
        self.assertEqual(got["memory_saving_bytes_estimate"], 700)

    def test_empty_zram_stat(self):
        self.assertIsNone(parse_zram_mm_stat(""))

    def test_limits(self):
        self.assertIsNone(parse_limit("max"))
        self.assertEqual(parse_limit("1024"), 1024)
        self.assertIsNone(parse_limit("invalid"))
        self.assertEqual(safe_percent(50, 200), 25.0)
        self.assertIsNone(safe_percent(50, None))


if __name__ == "__main__":
    unittest.main()
